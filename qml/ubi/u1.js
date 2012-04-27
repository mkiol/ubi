// u1.js
.pragma library

Qt.include("oauth/oauth.js")
Qt.include("oauth/sha1.js")

function getToken(user,pass,root)
{
    var url = "https://login.ubuntu.com/api/1.0/authentications?ws.op=authenticate&token_name=Ubuntu%20One%20@%20Ubi"
    var xhr = new XMLHttpRequest();
    if(user && pass) {
        xhr.open("GET",url,true,user,pass);
        xhr.onreadystatechange = function() {
                    if(xhr.readyState===4) {
                        //console.log(xhr.status);
                        if(xhr.status>=400) {
                            root.onErr(xhr.status);
                        } else {
                            //console.log(xhr.responseText);
                            var resp = eval('('+xhr.responseText+')');
                            var secrets = {
                                token: resp.token,
                                secret: resp.token_secret,
                                consumer_key : resp.consumer_key,
                                consumer_secret: resp.consumer_secret,
                            };
                            registerToken(secrets,user,root);
                        }
                    }
                }
        xhr.send();
    } else {
        root.onErr(0);
    }
}

function oAuthRequest(url,secrets,method,range)
{
    var accessor = {
        consumerKey: secrets.consumer_key,
        consumerSecret: secrets.consumer_secret,
        token: secrets.token,
        tokenSecret: secrets.secret
    };
    if(!method) method = "GET";
    var message = {
        action: url,
        method: method,
        parameters: [
            ["oauth_consumer_key",accessor.consumerKey],
            ["oauth_token",accessor.token],
            ["oauth_version","1.0"]
        ]
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message,accessor);
    var xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    var auth = OAuth.getAuthorizationHeader("",message.parameters);
    xhr.setRequestHeader("Authorization",auth);
    if(range) xhr.setRequestHeader("Range",range);
    return xhr;
}

function oAuthHeader(url,secrets,method)
{
    var accessor = {
        consumerKey: secrets.consumer_key,
        consumerSecret: secrets.consumer_secret,
        token: secrets.token,
        tokenSecret: secrets.secret
    };
    if(!method) method = "GET";
    var message = {
        action: url,
        method: method,
        parameters: [
            ["oauth_consumer_key",accessor.consumerKey],
            ["oauth_token",accessor.token],
            ["oauth_version","1.0"]
        ]
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message,accessor);
    return OAuth.getAuthorizationHeader("",message.parameters);
}

function registerToken(secrets,user,root)
{
    var url = "https://one.ubuntu.com/oauth/sso-finished-so-get-tokens/" + user;
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400) {
                        //console.log(xhr.responseText);
                        root.onErr(xhr.status);
                    } else {
                        //root.onResp(secrets);
                        //console.log(xhr.responseText);
                        getAccount(secrets,root);
                    }
                }
            }
    xhr.send();
}

function getAccount(secrets,root)
{
    var url = "https://one.ubuntu.com/api/account/";
    var xhr = oAuthRequest(url,secrets);
    //console.log("getAccount");
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log(xhr.status);
                        //console.log(xhr.responseText);
                        //console.log("getAccount: err");
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        //console.log("getAccount: ok");
                        var account = eval('('+xhr.responseText+')');
                        root.onResp(secrets,account);
                    }
                }
            }
    xhr.send();
}

function getFiles(secrets,rootNode,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"
            +encodeURI(rootNode)+"/?include_children=true";
    //console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        var nodes = resp.children;
                        root.onResp(nodes);
                    }
                }
            }
    xhr.send();
}

function getFileTree(secrets,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1";
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        console.log(xhr.status);
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        var rootNode = resp.root_node_path;
                        getFiles(secrets,rootNode,root);
                    }
                }
            }
    xhr.send();
}

function renameFile(secrets,resourcePath,targetPath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    //console.log("url: "+url);
    //console.log("target: "+encodeURI(targetPath));
    //console.log("target: "+targetPath);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    //var body = '{"path":"'+encodeURI(targetPath)+'"}';
    var body = '{"path":"'+targetPath+'"}';
    //console.log("body: "+body);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrRename(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        //console.log(resp);
                        root.onRespRename(resp);
                    }
                }
            }

    xhr.send(body);
}

function newFolder(secrets,resourcePath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    var body = '{"kind": "directory"}';
    console.log("body: "+body);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrNew(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onRespNew();
                    }
                }
            }

    xhr.send(body);
}

function deleteFile(secrets,resourcePath,root,utils)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    //console.log("url: "+url);
    var auth = oAuthHeader(url,secrets,"DELETE");
    utils.deleteFile(url,auth);
}

function getFileContentType(secrets,root,path)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);
    var url = "https://files.one.ubuntu.com"+encodeURI(path);
    //console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets,"GET","bytes=0-10");
    xhr.onreadystatechange = function() {
                console.log("readyState: "+xhr.readyState);
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                    } else {
                        var filename;
                        var ind = path.lastIndexOf("/");
                        if(ind>=0) {
                            filename = path.substr(ind+1);
                        }  else {
                            filename = path;
                        }
                        var type = xhr.getResponseHeader("content-type");
                        //console.log("filename: "+filename+" type: "+type);
                        root.setContentType(type);
                    }
                }
            }
    xhr.send();
}

function fixFilename(path) {
    path = path.toString();
    //console.log(path);
    var ind = path.lastIndexOf("/");
    if(ind>=0) {
        path = path.substr(ind+1);
    }
    if(path=="") path = "/";

    return path;
}

function fixFolder(path) {
    path = path.toString();
    //console.log(path);
    var ind = path.lastIndexOf("file://");
    if(ind>=0) {
        path = path.substr(ind+7);
    }
    if(path=="") path = "/";

    return path;
}

function getFileContent(secrets,root,path,folder,size,utils)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);
    var url = "https://files.one.ubuntu.com"+encodeURI(path);
    var filename = fixFilename(path);
    var ffolder = fixFolder(folder);
    //console.log("url: "+url);
    //console.log("ffolder: "+ffolder);
    var auth = oAuthHeader(url,secrets,"GET");
    //console.log("auth: "+auth);
    utils.downloadFile(ffolder,filename,url,size,auth);
}

function uploadFile(secrets,root,path,filename,folder,utils)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);
    //var url = "https://files.one.ubuntu.com"+path;
    var url = "https://files.one.ubuntu.com"+encodeURI(path);
    //console.log(url);
    var ffolder = fixFolder(folder);
    var auth = oAuthHeader(url,secrets,"PUT");
    utils.uploadFile(ffolder,filename,url,auth);
}


