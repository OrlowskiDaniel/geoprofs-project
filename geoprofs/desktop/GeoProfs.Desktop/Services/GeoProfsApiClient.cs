using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Services
{
    /// <summary>
    /// Every call to the Laravel API goes through here, same idea as
    /// the React app's src/api/client.js — one shared place, so both
    /// clients follow the same "talk to the API, never to MySQL directly" rule.
    /// </summary>
    public class GeoProfsApiClient
    {
        private readonly HttpClient _http;

        public GeoProfsApiClient()
        {
            _http = new HttpClient
            {
                // php artisan serve default. Change to your real host/port,
                // or load from config later.
                BaseAddress = new Uri("http://127.0.0.1:8000/api/")
            };
        }

        public async Task<string> GetHelloMessageAsync()
        {
            var response = await _http.GetAsync("hello");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            return doc.RootElement.GetProperty("message").GetString() ?? "(no message)";
        }
    }
}
