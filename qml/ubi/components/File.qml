import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import "../UIConstants.js" as Const


Item {
    id: root
    property alias name: label.text
    property bool isDirectory: false
    property variant properties: null
    property string filename: ""
    property int textMax: 27

    state: mouseArea.pressed && !root.disabled ? "pressed" : "unpressed"

    //width: box.width
    height: box.height

    signal clicked(variant prop)

    /*Rectangle {
        id: shadow
        width: box.width
        height: box.height
        color: Const.SHADOW_COLOR;
        radius: 10
        x: Const.SHADOW_OFFSET;
        y: Const.SHADOW_OFFSET;
    }*/

    Rectangle {
        id: box
        color: Const.TRANSPARENT
        height: label.height+3*Const.DEFAULT_MARGIN
        width: root.width
    }

    Rectangle {
        width: box.width-2*Const.TEXT_MARGIN+2*Const.DEFAULT_MARGIN
        height: box.height
        x: box.x
        y: box.y
        //color: root.isDirectory ? "white" : "black"
        color: Const.DEFAULT_DIALOG_FOREGROUND_COLOR
        anchors.verticalCenter: box.verticalCenter
        anchors.horizontalCenter: box.horizontalCenter
        opacity: 0.4
        radius: 10
        visible: mouseArea.pressed
    }

    Image {
        id: icon
        width: 40
        height: 40
        x: Const.TEXT_MARGIN
        source: root.isDirectory ? "../images/folder.png" : "../images/file-black.png"
        sourceSize.width: width
        sourceSize.height: height
        anchors.verticalCenter: box.verticalCenter
    }

    Text {
        id: label
        x: Const.TEXT_MARGIN + icon.width + Const.DEFAULT_MARGIN
        font.pixelSize: 30
        color: root.isDirectory ? "white" : "black"
        //color: "white"
        elide: Text.ElideRight
        wrapMode: Text.Wrap
        width: root.width-x-Const.TEXT_MARGIN-Const.DEFAULT_MARGIN-arrow.width

        //width: root.width
        anchors.verticalCenter: box.verticalCenter
        /*onTextChanged: {
            if(text.length>root.textMax)
                root.name = text.substring(0,root.textMax-3)+"...";
        }*/
    }

    Image {
        id: arrow
        width: 12
        height: 20
        anchors.right: box.right
        anchors.margins: Const.TEXT_MARGIN
        source: root.isDirectory ? "../images/arrow-frw.png" : "../images/arrow-frw-black.png"
        sourceSize.width: width
        sourceSize.height: height
        anchors.verticalCenter: box.verticalCenter
    }

    MouseArea {
        id: mouseArea
        width: box.width
        height: box.height
        onClicked: {
            root.clicked(root.properties);
        }
    }

    /*states: [
        State {
            name: "unpressed"
            PropertyChanges {target: shadow; x: Const.SHADOW_OFFSET}
            PropertyChanges {target: shadow; y: Const.SHADOW_OFFSET}
            PropertyChanges {target: box; x: 0}
            PropertyChanges {target: box; y: 0}
        },
        State {
            name: "pressed"
            PropertyChanges {target: shadow; x: Const.SHADOW_OFFSET}
            PropertyChanges {target: shadow; y: Const.SHADOW_OFFSET}
            PropertyChanges {target: box; x: Const.SHADOW_OFFSET}
            PropertyChanges {target: box; y: Const.SHADOW_OFFSET}
        }
    ]*/
}
