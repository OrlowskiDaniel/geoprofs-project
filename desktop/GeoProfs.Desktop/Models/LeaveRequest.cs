using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;

        // "Pending" | "Approved" | "Rejected"
        public string Status { get; set; } = "Pending";

        public DateTime RequestedAt { get; set; }
    }
}
