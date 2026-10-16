using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Services
{
    // Thrown by IGeoProfsApiClient when a call fails (network error or
    // non-2xx response)
    // Carries the documented { "message", "errors" }
    // shape from docs/API.md so the ViewModel can show something useful
    // instead of a raw exception message
    public class ApiException : Exception
    {
        public int? StatusCode { get; }
        public IDictionary<string, string[]>? Errors { get; }

        public ApiException(string message, int? statusCode = null, IDictionary<string, string[]>? errors = null)
            : base(message)
        {
            StatusCode = statusCode;
            Errors = errors;
        }
    }
}
