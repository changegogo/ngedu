/**
 * MD5 encrypt.
 *
 * @file    MD5.js
 * @author  lengchao
 * @version
 * @date    2016-05-19
 */

var crypto = require( "crypto" );

var ___password__ = "_____easyworks___";

/**
 * encrypt password.
 *
 * @param input input string.
 */
exports.encrypt = function( input ) {

    var hash , key , iv;

    hash = crypto.createHash( "md5" );
    hash.update( ___password__ );
    key = hash.digest( "hex" );

    hash = crypto.createHash( "md5" );
    hash.update( ___password__ + key );
    iv = hash.digest( "hex" );

    var data = new Buffer( input , "utf8" ).toString( "binary" );
    var cipher = crypto.createCipheriv( "aes-256-cbc" , key , iv.slice( 0 , 16 ) );

    var nodeVersion = process.version.match( /^v(\d+)\.(\d+)/ );
    //var encrypted = ( nodeVersion[ 1 ] === "0" && parseInt( nodeVersion[ 2 ] ) < 10 )
    //                    ? cipher.update( data , "binary" )
    //                    : cipher.update( data , "utf8" , "binary" )
    //;
    var encrypted = cipher.update( data , "utf8" , "binary" );
    encrypted += cipher.final( "binary" );

    var encoded = new Buffer( encrypted , "binary" ).toString( "hex" );

    return encoded;
};

/**
 * decrypt password.
 *
 * @param input
 */
exports.decrypt = function( input ) {

    var encryptData , hash , key , iv;

    // convert urlsafe hex to normal hex
    input = input.replace( /-/g , "+" ).replace( /_/g , "/" );
    // convert from hex to binary string
    encryptData = new Buffer( input , "hex" ).toString( "binary" );

    // craete key from password
    hash = crypto.createHash( "md5" );
    hash.update( ___password__ );
    key = hash.digest( "hex" );

    // craete iv from password and key
    hash = crypto.createHash( "md5" );
    hash.update( ___password__ + key );
    iv = hash.digest( "hex" );

    // decipher encrypted data
    var decipher = crypto.createDecipheriv( "aes-256-cbc" , key , iv.slice( 0 , 16 ) );

    var plaintext = decipher.update( encryptData , "binary" , "utf8" ) + decipher.final( "utf8" );

    return plaintext;
};
