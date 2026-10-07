using GeoProfs.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Services
{
    /// <summary>
    /// Handles all communication between the WPF application
    /// and the Laravel API
    /// </summary>
    public class GeoProfsApiClient : IGeoProfsApiClient
    {
        private readonly HttpClient _http;

        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public GeoProfsApiClient()
        {
            _http = new HttpClient
            {
                BaseAddress = new Uri("http://127.0.0.1:8000/api/")
            };

            _http.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );
        }

        /// <summary>
        /// Logs the user into Laravel
        /// POST /api/login
        /// </summary>
        public async Task<LoginResponse> LoginAsync(
            string email,
            string password)
        {
            var loginRequest = new LoginRequest
            {
                Email = email,
                Password = password
            };

            // Serialize what is being sent
            var json = JsonSerializer.Serialize(
                loginRequest,
                _jsonOptions
            );

            using var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            using var response = await _http.PostAsync(
                "login",
                content
            );

            var responseBody =
                await response.Content.ReadAsStringAsync();

            // If Laravel rejects the request include the response body in the exception
            if (!response.IsSuccessStatusCode)
            {
                throw new ApiException(
                    $"Login failed ({(int)response.StatusCode}): {responseBody}",
                    (int)response.StatusCode
                );
            }

            var result = JsonSerializer.Deserialize<LoginResponse>(
                responseBody,
                _jsonOptions
            );

            if (result == null)
            {
                throw new ApiException(
                    $"Login response was empty or invalid. Response: {responseBody}",
                    (int)response.StatusCode
                );
            }

            if (string.IsNullOrWhiteSpace(result.Token))
            {
                throw new ApiException(
                    $"Login succeeded but Laravel did not return a token. Response: {responseBody}",
                    (int)response.StatusCode
                );
            }

            // Save Laravel Sanctum token
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    result.Token
                );

            return result;
        }

        /// <summary>
        /// Gets pending leave requests
        /// GET /api/approvals/pending
        /// </summary>
        public async Task<List<LeaveRequest>> GetPendingApprovalsAsync()
        {
            using var response = await _http.GetAsync(
                "approvals/pending"
            );

            await EnsureSuccessAsync(response);

            var result =
                await response.Content.ReadFromJsonAsync<List<LeaveRequest>>(
                    _jsonOptions
                );

            return result ?? new List<LeaveRequest>();
        }

        /// <summary>
        /// Approves a leave request
        /// POST /api/approvals/{id}/approve
        /// </summary>
        public async Task ApproveAsync(int id)
        {
            using var response = await _http.PostAsync(
                $"approvals/{id}/approve",
                null
            );

            await EnsureSuccessAsync(response);
        }

        /// <summary>
        /// Rejects a leave request
        /// POST /api/approvals/{id}/reject
        /// </summary>
        public async Task RejectAsync(int id)
        {
            using var response = await _http.PostAsync(
                $"approvals/{id}/reject",
                null
            );

            await EnsureSuccessAsync(response);
        }

        private static async Task EnsureSuccessAsync(
            HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
                return;

            var responseBody =
                await response.Content.ReadAsStringAsync();

            ApiErrorBody? body = null;

            try
            {
                body = JsonSerializer.Deserialize<ApiErrorBody>(
                    responseBody,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );
            }
            catch
            {
                // Response was not JSON
            }

            throw new ApiException(
                body?.Message ??
                $"Request failed with status {(int)response.StatusCode}. Response: {responseBody}",
                (int)response.StatusCode,
                body?.Errors
            );
        }

        private class ApiErrorBody
        {
            public string? Message { get; set; }

            public Dictionary<string, string[]>? Errors { get; set; }
        }
    }
}