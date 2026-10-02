using GeoProfs.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Xps;

namespace GeoProfs.Desktop.Services
{
    /// <summary>
    /// Every call to the Laravel API goes through here, same idea as
    /// the React app's src/api/client.js - one shared place, so both
    /// clients follow the same "talk to the API, never to MySQL directly" rule
    /// </summary>
    public class GeoProfsApiClient : IGeoProfsApiClient
    {
        private readonly HttpClient _http;

        public GeoProfsApiClient()
        {
            _http = new HttpClient
            {
                // php artisan serve default
                // load from config later
                BaseAddress = new Uri("http://127.0.0.1:8000/api/")
            };
        }

        public async Task<List<LeaveRequest>> GetPendingApprovalsAsync()
        {
            var response = await _http.GetAsync("approvals/pending");
            await EnsureSuccessAsync(response);

            // adjust if the real response wraps the array like { "data": [...] } 
            var result = await response.Content.ReadFromJsonAsync<List<LeaveRequest>>();
            return result ?? new List<LeaveRequest>();
        }


        public async Task ApproveAsync(int id)
        {
            var response = await _http.PostAsync($"api/approvals/{id}/approve", content: null);
            await EnsureSuccessAsync(response);
        }

        public async Task RejectAsync(int id)
        {
            var response = await _http.PostAsync($"api/approvals/{id}/reject", content: null);
            await EnsureSuccessAsync(response);
        }





        // parses the documented { "message": "...", "errors": {...} } shape
        // on failure and throws ApiException so the ViewModel can display it
        private static async Task EnsureSuccessAsync(HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode) return;

            ApiErrorBody? body = null;
            try
            {
                body = await response.Content.ReadFromJsonAsync<ApiErrorBody>();
            }
            catch
            {
                // Response wasn't valid JSON in the expected shape, fall through
                // and surface the status code
            }

            throw new ApiException(
                body?.Message ?? $"Request failed with status {(int)response.StatusCode}.",
                (int)response.StatusCode,
                body?.Errors);
        }

        private class ApiErrorBody
        {
            public string? Message { get; set; }
            public Dictionary<string, string[]>? Errors { get; set; }
        }
    }
}
