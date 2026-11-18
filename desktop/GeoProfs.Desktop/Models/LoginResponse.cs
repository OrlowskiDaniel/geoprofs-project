using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Models
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;

        public User User { get; set; } = new();
    }
}