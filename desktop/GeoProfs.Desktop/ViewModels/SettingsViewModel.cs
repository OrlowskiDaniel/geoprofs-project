using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Models;

namespace GeoProfs.Desktop.ViewModels
{
    public class SettingsViewModel : ViewModelBase
    {
        public PlanningSettings PlanningSettings { get; }

        private string _selectedTab = "General";

        public string SelectedTab
        {
            get => _selectedTab;
            set => SetProperty(ref _selectedTab, value);
        }

        public ICommand SelectTabCommand { get; }

        public SettingsViewModel(PlanningSettings planningSettings)
        {
            PlanningSettings = planningSettings;

            SelectTabCommand = new RelayCommand(
                tab => SelectedTab = tab?.ToString() ?? "General");
        }
    }
}