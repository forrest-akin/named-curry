import curry from '.index.js'
import { tapIO } from './utils.js'


const fun =
    ( a = 0 , b = 1 , c = 3 , ...d ) =>
        a + b + c
        + d.reduce(
                ( x , y ) =>
                    x + y
            , 0 )


curry( tapIO( fun , 'fun' ) , [ 'a' , 'b' , 'c' , 'd' ]
// apply positionally by default
)( 1337 )                       //=> a=1337
// apply args to named param dynamically
.applyTo( 'd' )( 4 , 5 , 6 )    //=> a=1337 , d=[4,5,6]
// apply args to named param statically
//      can override a previously applied param
//      overriding a rest arg replaces all args previously applied to it
.$a( 1 )                        //=> a=1 , d=[4,5,6]
// force call before all args are received to apply default parameters
.force( 2 )                     //=> a=1 , b=2 , c=3 , d=[4,5,6]
                                //=> 21
