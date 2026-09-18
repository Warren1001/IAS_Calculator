#!/usr/bin/env python3

import http.server
import socketserver

HOST = "localhost"
PORT = 8000


class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        ".js": "application/javascript",
        ".css": "text/css",
    }

    def version_string(self):
        return "Apache/1.3.0 (Win32)"


try:
    with socketserver.TCPServer((HOST, PORT), HttpRequestHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    pass