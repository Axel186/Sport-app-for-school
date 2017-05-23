module.exports = {
  set: function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 1 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var path = "path=/";
    document.cookie = cname + "=" + cvalue + "; " + expires + '; ' + path;
  },

  get: function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  },

  delete: function(name, path, domain) {
    var cookie = this.get(name);

    if (cookie) {
      document.cookie = name + "=" +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "") +
        ";expires=Thu, 01 Jan 2016 00:00:01 GMT";
    }
  }
};
