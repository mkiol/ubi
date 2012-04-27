import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import "UIConstants.js" as Const
import "u1.js" as U1
import "components"

Page {
    id: root
    title: "Ubi"

    Component.onCompleted: init()

    function init() {
        if(Utils.isAuthorized()) {
            //title = "Hi, "+Utils.name();
        } else {
            console.log("not authorized!");
            pageStack.initialPage = "LoginPage.qml";
        }
    }

    menu: [
        [qsTr("About Ubi"),false]
    ]

    function menuFun(id) {
        if(id==qsTr("About Ubi")) {
            dialog.open();
        }
    }

    Column {
        spacing: 10
        anchors.centerIn: parent

        /*Image {
            source: "images/cloud.png"
            width: 150; height: 98
        }

        Spacer{}
        Spacer{}
        Spacer{}
        Spacer{}*/

        Button {
            label: qsTr("Files")
            anchors.horizontalCenter: parent.horizontalCenter
            onButtonClicked: {
                pageStack.push("FilesPage.qml");
                pageStack.currentPage.init();
            }
        }

        /*Button {
            label: "Contacts"
            disabled: true
        }
        Button {
            label: "Notes"
            disabled: true
        }*/

        Button {
            label: qsTr("Account")
            anchors.horizontalCenter: parent.horizontalCenter
            onButtonClicked: {
                pageStack.push("AccountPage.qml");
            }
        }
        Button {
            label: qsTr("Settings")
            anchors.horizontalCenter: parent.horizontalCenter
            onButtonClicked: pageStack.push("SettingsPage.qml");
        }
        /*Button {
            label: "Test"
            //onButtonClicked: tip.show("Ala ma kota!")
            //onButtonClicked: dialog.open()
            //onButtonClicked: U1.getAccount()
        }*/

        //Spacer{}

    }

    DialogInfo {
        id: dialog
        z: 200
        fontSize: 28
        //iconSource: "images/ubi50.png"
        text: qsTr("<b>Ubi</b> 0.9.1<br/>"
              +"Ubuntu One client for Maemo 5<br/>"
              +"<small>Copyright © 2012 Michal Kosciesza</small><br/>")
        onOpened: mask.state = "dialog"
        onCanceled: mask.state = "idle"
    }


    Text {
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 10
        anchors.horizontalCenter: parent.horizontalCenter
        font.pixelSize: 18
        color: "white"
        text: "| v0.9.0 beta |"
    }
}