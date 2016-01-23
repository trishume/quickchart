import vibe.d;
import std.random;

enum numSeries = 7;

struct Room {
  WebSocket socket;
  int[numSeries] curVals;

  this(WebSocket sock) {
    socket = sock;
    foreach(ref x; curVals) {
      x = 0;
    }
  }

  void sendData() {
    auto json = serializeToJsonString(curVals);
    socket.send(json);
  }
}
private Room[string] rooms;

final class QuickChart {
  void getWS(string room, scope WebSocket socket) {
    rooms[room] = Room(socket);

    while (socket.waitForData) {
      if (!socket.connected) break;
      auto text = socket.receiveText;
      logInfo("Received: \"%s\" from %s.", text, room);
    }

    socket.close;
    rooms.remove(room);
  }
}

void testData() {
  if(!("main" in rooms)) return;
  auto room = rooms["main"];

  room.curVals[0] = uniform(0,100);
  room.curVals[1] = uniform(20,50);
  room.curVals[2] = uniform(0,20);
  room.sendData();
}

shared static this() {
  auto router = new URLRouter;
  router.registerWebInterface(new QuickChart);
  router.get("*", serveStaticFiles("./public/"));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	listenHTTP(settings, router);

	logInfo("Please open http://127.0.0.1:8080/ in your browser.");

  setTimer(msecs(500), toDelegate(&testData), true);
}
