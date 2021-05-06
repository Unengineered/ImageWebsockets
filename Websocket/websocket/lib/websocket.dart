import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:websocket/constants.dart';

class Home extends StatelessWidget {
  final WebSocketChannel channel = WebSocketChannel.connect(Uri.parse(URL));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Websocket"),
      ),
      body: StreamBuilder(
        stream: channel.stream,
        builder: (context, snapshot) {
          print(snapshot.data.runtimeType);
          return Center(
            child: snapshot.hasData
                ? snapshot.data is String
                    ? Text(snapshot.data)
                    : Image.memory(snapshot.data)
                : Text("no image"),
          );
        },
      ),
    );
  }
}
