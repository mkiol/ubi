import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import "../UIConstants.js" as Const

Item {
    id: root
    property string label
    property bool disabled: false
    property int fontSize: 30
    property int maxSize: 27
    property string iconSource

    state: mouseArea.pressed && !root.disabled ? "pressed" : "unpressed"

    width: box.width
    height: box.height

    signal buttonClicked(string label)

    Rectangle {
        id: shadow
        width: box.width
        height: box.height
        color: Const.SHADOW_COLOR;
        radius: 10
        visible: false
    }

    Rectangle {
        id: box
        color: root.disabled ? Const.COOL_GREY_COLOR : "black"
        height: root.iconSource=="" ? textbox.height+20 : icon.height+20
        //width: textbox.width<100 ? 120 : textbox.width+20
        width: root.iconSource=="" ? textbox.width+30 : icon.width+30
        radius: 10
        visible: false
    }

    Image {
        source: root.state != "pressed" ?
                    "../images/pushbutton_normal.png" :
                    "../images/pushbutton_disabled.png"
    }

    Rectangle {
        width: box.width
        height: box.height
        x: box.x
        y: box.y
        color: Const.WARM_GREY_COLOR
        radius: 10
        //visible: root.state == "pressed"
        visible: false
        //border.color: "black"
        //border.width: Const.SHADOW_OFFSET
    }

    Image {
        id: icon
        //width: 30
        //height: 30
        anchors.centerIn: box
        source: root.iconSource == "" ? "" : "../" + root.iconSource
        sourceSize.width: width
        sourceSize.height: height
    }

    onLabelChanged: {
        if(root.label.length>root.maxSize) {
            //console.log("root.label: "+root.label)
            //console.log("root.label.length: "+root.label.length)
            //console.log("root.maxSize: "+root.maxSize)
            textbox.text = root.label.substring(0,root.maxSize-3)+"...";
        } else {
            textbox.text = root.label;
        }
    }

    Text {
        id: textbox
        font.pixelSize: root.fontSize
        color: root.disabled ? "gray" : "white"
        anchors.centerIn: box
        visible: root.iconSource == ""
    }

    MouseArea {
        id: mouseArea
        width: box.width
        height: box.height
        onClicked: root.buttonClicked(root.label)
        enabled: !root.disabled
    }

    states: [
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
    ]
}


