var CLIENT_ID = '920861587885-rb7tv3emgevlpqb6g4va0ncp1fh77ikd.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBLj4fLJ_Z2rV-BxJieR2e-S5eKnlVqKSc';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
/*

Client ID
920861587885-rb7tv3emgevlpqb6g4va0ncp1fh77ikd.apps.googleusercontent.com
Client Secret
eITK0uD4CK3udQ-BB62GjeB9
API Key
AIzaSyBLj4fLJ_Z2rV-BxJieR2e-S5eKnlVqKSc



{"web":{"client_id":"130878651121-5nopa9n8aar19pkel0qo3eg3dkv7veag.apps.googleusercontent.com",
    "project_id":"brave-framework-306118",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"TuzrIwgzucu1JxTM5kTdKSWg",
    "javascript_origins":["https://www.emailreplytime.com"]}}
*/
var loginPage = document.getElementById('login');
var gmailPage = document.getElementById('gmail');

var authorizeButton = document.getElementById('loginBtn');
var signoutButton = document.getElementById('logoutBtn');

authorizeButton.onclick = handleAuthClick;
signoutButton.onclick = handleSignoutClick;


function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
   
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

}, function(error) {
    alert(JSON.stringify(error, null, 2));
});
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        loginPage.classList.add("d-none");
        gmailPage.classList.remove("d-none");
        //getDriveFiles();
        //loadGmailApi();
        getGmailData();
    } else {
          loginPage.classList.remove("d-none");
          gmailPage.classList.add("d-none");
    }
 }

 function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function loadGmailApi() {
    gapi.client.load('gmail', 'v1', displayInbox);
  }
  /*******************END AUTHENTICATION*****************/
  

    function getGmailData(){
    var user = gapi.auth2.getAuthInstance().currentUser.get();
    var oauthToken = user.getAuthResponse().access_token;
    console.log(oauthToken);
    var xhr = new XMLHttpRequest();
    var userId='me';
    xhr.open('GET',
        'https://gmail.googleapis.com/gmail/v1/users/'+userId+'/messages');
    xhr.setRequestHeader('Authorization',
        'Bearer ' + oauthToken);
    xhr.send();
    xhr.onload=function () {
        var data=JSON.parse(this.response);
        for (let i in data.messages)
        {
           getMailInfo(data.messages[i].id,userId,oauthToken);

        }

    }

    }



    function getMailInfo(id,userId,oauthToken)
    {
        let xhr1 = new XMLHttpRequest();
        xhr1.open('GET','https://gmail.googleapis.com/gmail/v1/users/'+userId+'/messages/'+id,true);
        xhr1.setRequestHeader('Authorization',
        'Bearer ' + oauthToken);
        xhr1.send();
        xhr1.onload=function(){
            let mailInfo=JSON.parse(this.response);
console.log( mailInfo );
console.warn( mailInfo );
            var from=getHeader(mailInfo.payload.headers,"From");
            var subject=getHeader(mailInfo.payload.headers,"Subject");
            var date=getHeader(mailInfo.payload.headers,"Date");
            appendMailRow(from,subject,date);
    }
    }

     function getHeader(arr, index) {
         console.log(arr);
            for (i=0;i<arr.length;i++){
                console.log(arr[i].name);
                if(arr[i].name==index)
                {
                    return arr[i].value;
                }
            }
        }
        


    function appendMailRow(from,subject,date) {
        let tbody=document.getElementById("mailbody");
        let row=(
          '<tr>\
            <td>'+from+'</td>\
            <td>'+subject+'</td>\
            <td>'+date+'</td>\
          </tr>'
        );
        tbody.innerHTML+=row;
      }
