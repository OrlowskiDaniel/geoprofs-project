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
    public class PlanningSettings : ViewModelBase
    {
        private int _notEnoughMax = 6;
        private int _okayMax = 8;

        public int NotEnoughMax
        {
            get => _notEnoughMax;
            set => SetProperty(ref _notEnoughMax, value);
        }

        public int OkayMax
        {
            get => _okayMax;
            set => SetProperty(ref _okayMax, value);
        }
    }
}