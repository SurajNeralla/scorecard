import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

class ScorecardHandler(SimpleHTTPRequestHandler):
    # Default match state for SHC Scorecard
    state = {
        "team1": "TEAM 1",
        "team2": "TEAM 2",
        "score": "0/0",
        "overs": "0.0",
        "bat1": "BATSMAN 1",
        "bat1Score": "0",
        "bat1Balls": "0",
        "bat2": "BATSMAN 2",
        "bat2Score": "0",
        "bat2Balls": "0",
        "bowler": "BOWLER",
        "bowlerFigures": "0/0",
        "overRuns": "0 0 0 0",
        "event": ""
    }

    def do_GET(self):
        if self.path == '/state':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            # Bypass CORS so OBS and local browser can query happily
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(self.__class__.state).encode('utf-8'))
        elif self.path == '/':
            self.path = '/index.html'
            super().do_GET()
        else:
            # Serve the static HTML/JS files
            super().do_GET()

    def do_POST(self):
        if self.path == '/update':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                try:
                    new_data = json.loads(post_data.decode('utf-8'))
                    # Merge state
                    self.__class__.state.update(new_data)
                except Exception as e:
                    print("Error parsing JSON update:", e)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
        else:
            self.send_error(404)

if __name__ == '__main__':
    server_address = ('', 3000)
    httpd = HTTPServer(server_address, ScorecardHandler)
    print("=====================================================")
    print(" CRICKET SCORECARD SERVER RUNNING (SHC Version)")
    print("=====================================================")
    print(" [~] Control Panel: http://localhost:3000/admin.html")
    print(" [~] OBS Overlay URL: http://localhost:3000/")
    print("=====================================================")
    httpd.serve_forever()
