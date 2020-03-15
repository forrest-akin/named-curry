export const always = ( x ) => () => x

export const flip = ( f ) => ( x ) => ( y ) => f( y )( x )

export const noop = () => {}

export const pipe =
    ( f , ...fs ) => ( ...xs ) =>
        fs.reduce( ( x , g ) => g( x )
            , f( ...xs ) )

export const unnest = ( f ) => ( x ) => f( x )( x )

export const tap = ( x ) => ( console.log( x ) , x )

export const tapIn =
    ( f , label = f.name ) => ( ...xs ) =>
        ( console.log( { [ `${ label }::in` ] : xs } )
        , f( ...xs ) )

export const tapOut =
    ( label = '' ) => ( x ) =>
        ( console.log( { [ `${ label }::out` ] : x } )
        , x )

export const tapIO =
    ( f , label ) =>
        pipe( tapIn( f , label )
            , tapOut( label ) )



export const add = ( x ) => ( y ) => x + y

export const increment = add( 1 )

export const decrement = add( -1 )



export const eq = ( x ) => ( y ) => x === y

export const not = ( x ) => !x

export const notEq = ( x ) => pipe( eq( x ) , not )



export const prop = ( key ) => ( source ) => source[ key ]

export const getFrom = flip( prop )

export const _length = prop( 'length' )

export const setObject =
    ( key , value , target ) =>
        assign( target , { [ key ] : value } )

export const assign =
    ( target , ...sources ) =>
        unsafeAssign( {} , target , ...sources )

export const unsafeAssign =
    ( target , ...sources ) =>
        Object.assign( target , ...sources )



export const isEmpty = pipe( _length , eq( 0 ) )

export const concat = ( xs ) => ( ys ) => xs.concat( ys )

export const filter = ( f ) => ( xs ) => xs.filter( f )

export const flatten = ( ...xss ) => xss.flat()

export const map = ( f ) => ( xs ) => xs.map( f )

export const reduce =
    ( f ) => ( init = noop ) => ( xs ) =>
        xs.reduce( f , init() )

export const SizedArray = ( size ) => Array( size ).fill( undefined )

export const lastIndex = pipe( _length , decrement )

export const slice =
    ( begin , end ) => xs =>
        xs.slice( begin , end )

export const sliceFromLength = pipe( _length , slice )

export const sliceTo = ( end ) => slice( 0 , end )

export const sliceToLength = pipe( _length , sliceTo )

export const sliceToLastIndex = pipe( lastIndex , sliceTo )

export const head = prop( 0 )

export const tail = slice( 1 )

export const init = slice( 0 , -1 )

export const last = unnest( pipe( lastIndex , prop ) )

export const setArray =
    ( index , value , target ) =>
        splice( index , 1 , value )( target )

export const splice =
    ( index , deleteCount , ...insertions ) =>
        pipe( slice()
            , unsafeSplice( index , deleteCount , ...insertions ) )

export const unsafeSplice =
    ( index , deleteCount , ...insertions ) => target =>
        ( target.splice( index , deleteCount , ...insertions )
        , target )

export const unsafeSet =
    ( target , key , x ) =>
        ( target[ key ] = x
        , target )

export const keyIndexesByVal = reduce( unsafeSet )( Object )
