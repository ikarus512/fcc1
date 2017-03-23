var extend = require('extend');

function shareit(opt){
  if (  opt &&
        opt.title &&
        opt.text &&
        opt.img &&
        opt.url
     )
  {
    return {
      // shareit_facebook: '' +
      //   'http://www.facebook.com/sharer.php' +
      //   '?s=100' +
      //   '&p[title]='     + encodeURIComponent(opt.title) +
      //   '&p[summary]='   + encodeURIComponent(opt.text) +
      //   '&p[url]='       + encodeURIComponent(opt.url) +
      //   '&p[images][0]=' + encodeURIComponent(opt.img) +
      //   '',


      shareit_twitter: '' +
        // 'https://twitter.com/intent/tweet' + // doc at https://dev.twitter.com/web/tweet-button
        // '?text=' + encodeURIComponent(opt.text) +
        // '&url=' + encodeURIComponent(opt.url) +

        'http://twitter.com/share' +
        '?text='     + encodeURIComponent(opt.title) +
        '&url='      + encodeURIComponent(opt.url) +
        '&counturl=' + encodeURIComponent(opt.url) +
        '',

      // shareit_odnoklassniki: '' +
      //   'http://www.odnoklassniki.ru/dk' +
      //   '?st.cmd=addShare&st.s=1' +
      //   '&st.comments=' + encodeURIComponent(opt.text) +
      //   '&st._surl='    + encodeURIComponent(opt.url) +
      //   '',

      // shareit_vk: '' +
      //   // 'https://vk.com/share.php' + // doc at https://vk.com/dev/share_details
      //   // '?title=' + encodeURIComponent(opt.text) +
      //   // '&url='   + encodeURIComponent(opt.url) +

      //   'http://vkontakte.ru/share.php' +
      //   '?url='         + encodeURIComponent(opt.url) +
      //   '&title='       + encodeURIComponent(opt.title) +
      //   '&description=' + encodeURIComponent(opt.text) +
      //   '&image='       + encodeURIComponent(opt.img) +
      //   '&noparse=true' +
      //   '',

    };
  }
  return {};
}

module.exports = shareit;
