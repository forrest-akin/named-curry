import { _length , always , concat , eq , filter , getFrom , head , isEmpty
    , keyIndexesByVal , lastIndex , map , notEq , pipe , reduce , setArray
    , SizedArray , slice , sliceFromLength , sliceToLength , sliceToLastIndex , unsafeSet
} from './utils.js'

/*

Fun :: ( ...* ) -> a

Params :: [ Param ]
    a Param list with each corresponding positionally to Fun's parameters

Param :: String
    a parameter name

curry :: ( Fun , Params ) -> CurriedFun

CurriedFun :: ( ...* ) -> CurriedFun | a
    an auto-curried function that applies arguments positionally
    if all args have been applied returns the return type of Fun  
    else returns a new CurriedFun

    extends {
        applyTo :: Param -> ( ...* ) -> CurriedFun | a
            given a Param returns a function that applies the next args received by name.
            if given the last parameter, all args will be applied.
            otherwise, only the first is applied

        ${Param} :: (...args) -> CurriedFun | a
            apply args to a Param

        force :: ( ...* ) -> a
            calls the curried function immediately, applying any
            default parameters if all have not been received
    }

 */
export default function curry ( f , params ) {
    const call = ( ...args ) => f( ...args )

    const force =
        ( unapplied , applied ) => ( ...args ) =>
            call( ...applyByPosition( unapplied , applied , args ) )

    const next =
        ( unapplied , applied ) =>
            isEmpty( unapplied ) ? call( ...applied )
            : buildNext( unapplied , applied )

    const buildNext =
        ( unapplied , applied ) =>
            reduce(
                ( nextFn , [ key , attachMethod ] ) =>
                    unsafeSet( nextFn , key
                        , attachMethod( unapplied , applied , nextFn ) )
            )( always( curried( unapplied, applied ) )
            )( methodAttachers )

    const curried =
        ( unapplied , applied ) => ( ...args ) =>
            next( sliceFromLength( args )( unapplied )
                , applyByPosition( unapplied , applied , args ) )

    const applyByPosition =
        ( unapplied , applied , args ) =>
            reduce(
                ( nextApplied , param , index ) =>
                    isLastParam( param )
                    ? applyLastParam( slice( index )( args ) , nextApplied )
                    : applyParam( param , getFrom( args )( index ) , nextApplied )
            )( always( applied )
            )( sliceToLength( args )( unapplied ) )

    const applyByName =
        ( unapplied , applied ) => ( param ) => ( ...args ) =>
            next( filter( notEq( param ) )( unapplied )
                , isLastParam( param )
                    ? applyLastParam( args , applied )
                    : applyParam( param , head( args ) , applied ) )

    const applyLastParam =
        ( args , applied ) =>
            concat( sliceToLastIndex( params )( applied ) )( args )

    const applyParam =
        ( param , x , applied ) =>
            setArray( getPositionByName( param ) , x , applied )

    const getPositionByName = getFrom( keyIndexesByVal( params ) )

    const isLastParam = pipe( getPositionByName , eq( lastIndex( params ) ) )

    const methodAttachers =
        concat(
            [ [ 'applyTo', applyByName ]
            , [ 'force' , force ] ]
        )(  map(
                ( param ) =>
                    [ '$' + param
                    , ( _ , __ , nextFn ) => nextFn.applyTo( param ) ]
            )( params ) )

    return next( params , SizedArray( lastIndex( params ) ) )
}
