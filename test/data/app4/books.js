/* file: books.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Books Test Data
 * AUTHOR: ikarus512
 * CREATED: 2017/04/20
 *
 * MODIFICATION HISTORY
 *  2017/04/20, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
/*jshint scripturl: true*/
'use strict';

module.exports = [

  //////////////////////////////////////////////////////////////////////////////
  {
    title: 'JavaScript: The Good Parts',
    keywords: 'JavaScript,programming',
    price: 21.80,
    photo: 'book1.jpg',
    description: '' +
      'Most programming languages contain good and bad parts, but JavaScript ' +
      'has more than its share of the bad, having been developed and ' +
      'released in a hurry before it could be refined. This authoritative ' +
      'book scrapes away these bad features to reveal a subset of JavaScript ' +
      'that\'s more reliable, readable, and maintainable than the language ' +
      'as a whole-a subset you can use to create truly extensible and ' +
      'efficient code.' +
      '\n\n' +

      'Considered the JavaScript expert by many people in the development ' +
      'community, author Douglas Crockford identifies the abundance of good ' +
      'ideas that make JavaScript an outstanding object-oriented ' +
      'programming language-ideas such as functions, loose typing, dynamic ' +
      'objects, and an expressive object literal notation. Unfortunately, ' +
      'these good ideas are mixed in with bad and downright awful ideas, ' +
      'like a programming model based on global variables.' +
      '\n\n' +

      'When Java applets failed, JavaScript became the language of the Web ' +
      'by default, making its popularity almost completely independent of ' +
      'its qualities as a programming language. In JavaScript: The Good ' +
      'Parts, Crockford finally digs through the steaming pile of good ' +
      'intentions and blunders to give you a detailed look at all the ' +
      'genuinely elegant parts of JavaScript, including:' +
      '\n\n' +

      '- Syntax\n' +
      '- Objects\n' +
      '- Functions\n' +
      '- Inheritance\n' +
      '- Arrays\n' +
      '- Regular expressions\n' +
      '- Methods\n' +
      '- Style\n' +
      '- Beautiful features\n' +
      '\n' +

      'The real beauty? As you move ahead with the subset of JavaScript that ' +
      'this book presents, you\'ll also sidestep the need to unlearn all the ' +
      'bad parts. Of course, if you want to find out more about the bad ' +
      'parts and how to use them badly, simply consult any other JavaScript ' +
      'book.' +
      '\n\n' +

      'With JavaScript: The Good Parts, you\'ll discover a beautiful, ' +
      'elegant, lightweight and highly expressive language that lets you ' +
      'create effective code, whether you\'re managing object libraries or ' +
      'just trying to get Ajax to run fast. If you develop sites or ' +
      'applications for the Web, this book is an absolute must.' +
      '\n' +
      ''
  },
  //////////////////////////////////////////////////////////////////////////////
  {
    title: 'JavaScript Patterns: Build Better Applications with Coding and ' +
      'Design Patterns',
    keywords: 'JavaScript,programming',
    price: 17.30,
    photo: 'book2.jpg',
    description: '' +

      'What\'s the best approach for developing an application with ' +
      'JavaScript? This book helps you answer that question with numerous ' +
      'JavaScript coding patterns and best practices. If you\'re an ' +
      'experienced developer looking to solve problems related to objects, ' +
      'functions, inheritance, and other language-specific categories, the ' +
      'abstractions and code templates in this guide are ideal-whether ' +
      'you\'re using JavaScript to write a client-side, server-side, or ' +
      'desktop application.' +
      '\n\n' +

      'Written by JavaScript expert Stoyan Stefanov-Senior Yahoo! Technical ' +
      'and architect of YSlow 2.0, the web page performance optimization ' +
      'tool-JavaScript Patterns includes practical advice for implementing ' +
      'each pattern discussed, along with several hands-on examples. You\'ll ' +
      'also learn about anti-patterns: common programming approaches that ' +
      'cause more problems than they solve.' +
      '\n\n' +

      '  Explore useful habits for writing high-quality JavaScript code, such ' +
      'as avoiding globals, using single var declarations, and more' + '\n' +
      '  Learn why literal notation patterns are simpler alternatives to ' +
      'constructor functions' + '\n' +
      '  Discover different ways to define a function in JavaScript' + '\n' +
      '  Create objects that go beyond the basic patterns of using object ' +
      'literals and constructor functions' + '\n' +
      '  Learn the options available for code reuse and inheritance in ' +
      'JavaScript' + '\n' +
      '  Study sample JavaScript approaches to common design patterns such ' +
      'as Singleton, Factory, Decorator, and more' + '\n' +
      '  Examine patterns that apply specifically to the client-side browser ' +
      'environment' + '\n' +
      ''
  },
  //////////////////////////////////////////////////////////////////////////////
  {
    title: 'Effective JavaScript: 68 Specific Ways to Harness the Power of ' +
      'JavaScript (Effective Software Development Series)',
    keywords: 'JavaScript,programming',
    price: 33.29,
    photo: 'book3.jpg',
    description: '' +

      '"It\'s uncommon to have a programming language wonk who can speak in ' +
      'such comfortable and friendly language as David does. His walk ' +
      'through the syntax and semantics of JavaScript is both charming and ' +
      'hugely insightful; reminders of gotchas complement realistic use ' +
      'cases, paced at a comfortable curve. You\'ll find when you finish ' +
      'the book that you\'ve gained a strong and comprehensive sense of ' +
      'mastery."' + '\n' +
      '-Paul Irish, developer advocate, Google Chrome' +
      '\n\n' +

      '"This is not a book for those looking for shortcuts; rather it is ' +
      'hard-won experience distilled into a guided tour. It\'s one of the ' +
      'few books on JS that I\'ll recommend without hesitation."' + '\n' +
      '-Alex Russell, TC39 member, software engineer, Google' +
      '\n\n' +

      'In order to truly master JavaScript, you need to learn how to work ' +
      'effectively with the language\'s flexible, expressive features and ' +
      'how to avoid its pitfalls. No matter how long you\'ve been writing ' +
      'JavaScript code, Effective JavaScript will help deepen your ' +
      'understanding of this powerful language, so you can build more ' +
      'predictable, reliable, and maintainable programs.' +
      '\n\n' +

      'Author David Herman, with his years of experience on Ecma\'s ' +
      'JavaScript standardization committee, illuminates the language\'s ' +
      'inner workings as never before-helping you take full advantage of ' +
      'JavaScript\'s expressiveness. Reflecting the latest versions of the ' +
      'JavaScript standard, the book offers well-proven techniques and best ' +
      'practices you\'ll rely on for years to come.' +
      '\n\n' +

      'Effective JavaScript is organized around 68 proven approaches for ' +
      'writing better JavaScript, backed by concrete examples. You\'ll learn ' +
      'how to choose the right programming style for each project, manage ' +
      'unanticipated problems, and work more successfully with every facet ' +
      'of JavaScript programming from data structures to concurrency. Key ' +
      'features include' + '\n' +
      '  Better ways to use prototype-based object-oriented programming' + '\n' +
      '  Subtleties and solutions for working with arrays and dictionary ' +
      'objects' + '\n' +
      '  Precise and practical explanations of JavaScript\'s functions and ' +
      'variable scoping semantics' + '\n' +
      '  Useful JavaScript programming patterns and idioms, such as options ' +
      'objects and method chaining' + '\n' +
      '  In-depth guidance on using JavaScript\'s unique "run-to-completion" ' +
      'approach to concurrency' + '\n' +
      ''
  },
  //////////////////////////////////////////////////////////////////////////////
  {
    title: 'JavaScript Pocket Reference: Activate Your Web Pages (Pocket ' +
      'Reference (O\'Reilly))',
    keywords: 'JavaScript,programming',
    price: 10.30,
    photo: 'book4.jpg',
    description: '' +

      'JavaScript is the ubiquitous programming language of the Web, and ' +
      'for more than 15 years, JavaScript: The Definitive Guide has been ' +
      'the bible of JavaScript programmers around the world. Ideal for ' +
      'JavaScript developers at any level, this book is an all-new excerpt ' +
      'of The Definitive Guide, collecting the essential parts of that hefty ' +
      'volume into this slim yet dense pocket reference.' +
      '\n\n' +

      'The first 9 chapters document the latest version (ECMAScript 5) of ' +
      'the core JavaScript language, covering:' +
      '\n' +

      '- Types, values, and variables' +
      '- Operators, expressions, and statements' +
      '- Objects and arrays' +
      '- Functions and classes' +
      '\n\n' +

      'The next 5 chapters document the fundamental APIs for using ' +
      'JavaScript with HTML5 and explain how to:' +
      '\n' +

      'Interact with web browser windows' + '\n' +
      'Script HTML documents and document elements' + '\n' +
      'Modify and apply CSS styles and classes' + '\n' +
      'Respond to user input events' + '\n' +
      'Communicate with web servers' + '\n' +
      'Store data locally on the user\'s computer' + '\n' +
      'This book is a perfect companion to jQuery Pocket Reference.' + '\n' +
      ''
  },
  //////////////////////////////////////////////////////////////////////////////
  {
    title: 'CSS Pocket Reference: Visual Presentation for the Web',
    keywords: 'CSS,programming',
    price: 9.30,
    photo: 'book5.jpg',
    description: '' +

      'When you\'re working with CSS and need a quick answer, CSS Pocket ' +
      'Reference delivers. This handy, concise book provides all of the ' +
      'essential information you need to implement CSS on the fly. Ideal ' +
      'for intermediate to advanced web designers and developers, the 4th ' +
      'edition is revised and updated for CSS3, the latest version of the ' +
      'Cascading Style Sheet specification. Along with a complete ' +
      'alphabetical reference to CSS3 selectors and properties, you\'ll ' +
      'also find a short introduction to the key concepts of CSS.' +
      '\n\n' +

      'Based on Cascading Style Sheets: The Definitive Guide, this ' +
      'reference is an easy-to-use cheatsheet of the CSS specifications ' +
      'you need for any task at hand. This book helps you:' +
      '\n\n' +

      '- Quickly find and adapt the style elements you need' + '\n' +
      '- Learn how CSS3 features complement and extend your CSS practices' + '\n' +
      '- Discover new value types and new CSS selectors' + '\n' +
      '- Implement drop shadows, multiple backgrounds, rounded corners, ' +
      'and border images' + '\n' +
      '- Get new information about transforms and transitions' + '\n' +
      ''
  },
  //////////////////////////////////////////////////////////////////////////////
];
