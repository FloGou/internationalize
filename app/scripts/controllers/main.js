'use strict';

var extractHost = function(url){
    var parser = document.createElement('a');
    parser.href = url;
    return parser.host;
  };


angular.module('angApp')
  .controller('MainCtrl', function ($scope) {
    var elements;
    $scope.load = function(url) {
        $scope.undeterminate = true;

        $scope.var =[];
        $scope.modified= {};
        $scope.oldTexts = [];
        $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?',
            function(data){

                var mainDiv = document.createElement('body');


                //Delete all scripts in inner html
                mainDiv.innerHTML = data.contents.replace(/script/g, 'todelete');
                var scripts = mainDiv.getElementsByTagName('todelete');
                while (scripts.length>0) {
                  scripts[0].parentNode.removeChild(scripts[0]);
                }


                // Replace host in urls to get stylesheets and Images
                var host = extractHost(url);
                var links = mainDiv.getElementsByTagName('link');
                for (var i = 0; i < links.length; i++) {
                  links[i].href = links[i].href.replace('127.0.0.1:9000', host);
                  links[i].href = links[i].href.replace('localhost:9000', host);
                }

                var img = mainDiv.getElementsByTagName('img');
                for (i = 0; i < img.length; i++) {
                  img[i].src = img[i].src.replace('127.0.0.1:9000', host);
                  img[i].src = img[i].src.replace('localhost:9000', host);
                }

                // Invalidate links so that text can be modified
                var a = mainDiv.getElementsByTagName('a');
                for (i=0; i< a.length; i++) {
                    a[i].setAttribute('href', 'javascript:void(0);');
                }



                elements = mainDiv.getElementsByTagName('*');
                for (i = 0; i < elements.length; i++) {
                    // Select only "leaf" elements that contain text
                    // This is not the best way to do it as a paragraph containing <br/> will not be parsed
                    // TODO Find a best way.
                  if (!elements[i].firstElementChild && elements[i].innerText){
                            $scope.oldTexts[i] = elements[i].innerText;
                            $scope.var[i] = elements[i].innerText;
                            // Bind to the angular model
                            elements[i].setAttribute('ng-model', 'var.'.concat(i));
                            //Make the element editable
                            elements[i].setAttribute('contentEditable', true);
                            // We are in a Jquery callback, angular $scope is not applied automatically
                            $scope.$apply();


                  }
                }

                $scope.html = mainDiv.innerHTML;
                $scope.undeterminate=false;
                $scope.$apply();
              });
      };

  });