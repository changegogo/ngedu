/**
 * @file    filter.js
 * @author  lengchao
 * @version
 * @date    2016-05-14
 */

"use strict";

var app = angular.module( "ngedu" );

/**
 * format chapter number.
 */
app.filter( "formatChapterNumberFilter" , function() {

    return function( chapterNumber ) {

        var formatter = "第{chapterNumber}章";

        return formatter.replace( "{chapterNumber}" , chapterNumber );
    };
} );
/**
 * format section number.
 */
app.filter( "formatSectionNumberFilter" , function() {

    return function( sectionNumber ) {

        var formatter = "第{sectionNumber}节";

        return formatter.replace( "{sectionNumber}" , sectionNumber );
    };
} );

/**
 * format business names.
 */
app.filter( "formatBusinessNamesFilter" , function() {

    return function( businesses , separator ) {

        var businessNames = [];

        // get all of the business names
        $.each( businesses , function( index , business ) {

            businessNames.push( business.name );
        } );

        return businessNames.join( separator || "、" );
    };
} );

/**
 * processing information text of question bank type.
 */
app.filter( "convertQuestionBankTypeFilter" , function() {

    return function( type , isMultiSelect ) {

        var text = "";

        switch( type ) {
            // 选择题
            case "ChoiceQuestion":
                text = "选择题";
                text += "（";
                text += ( isMultiSelect ? "多选" : "单选" );
                text += "）";
                break;
            // 判断题
            case "TrueOrFalseQuestion":
                text = "判断题";
                break;
        }

        return text;
    };
} );
