using System;
using System.Collections.Generic;

namespace GeoProfs.Desktop.Models
{
    public class StaffingPlanningResponse
    {
        public string Department { get; set; } = "";

        public string Date { get; set; } = "";

        public string DateEnd { get; set; } = "";

        public int TotalEmployees { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public string MinimumPresence { get; set; } = "";

        public bool MinimumMet { get; set; }

        public List<DailyStaffing> Days { get; set; } = new();
    }

    public class DailyStaffing
    {
        public DateTime Date { get; set; }

        public int TotalEmployees { get; set; }

        public int Present { get; set; }

        public int Absent { get; set; }

        public int MinimumPresence { get; set; }

        public bool MinimumMet { get; set; }
    }
}