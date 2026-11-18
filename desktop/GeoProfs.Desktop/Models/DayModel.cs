using GeoProfs.Desktop.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace GeoProfs.Desktop.Models
{
    public class DayModel : ViewModelBase
    {
        private DateTime? _date;
        private int? _employeeCount;
        private StaffingStatus _status;
        private bool _isCurrentMonth;
        private bool _isSelected;

        public bool IsToday { get; set; }

        public DateTime? Date
        {
            get => _date;
            set
            {
                if (SetProperty(ref _date, value))
                    OnPropertyChanged(nameof(DayNumber));
            }
        }

        public string DayNumber =>
            Date.HasValue ? Date.Value.Day.ToString() : "";

        public int? EmployeeCount
        {
            get => _employeeCount;
            set => SetProperty(ref _employeeCount, value);
        }

        public StaffingStatus Status
        {
            get => _status;
            set => SetProperty(ref _status, value);
        }

        public bool IsCurrentMonth
        {
            get => _isCurrentMonth;
            set => SetProperty(ref _isCurrentMonth, value);
        }

        public bool IsSelected
        {
            get => _isSelected;
            set => SetProperty(ref _isSelected, value);
        }
    }
}