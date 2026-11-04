using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Common;

namespace GeoProfs.Desktop.ViewModels
{
    public class CalendarViewModel : ViewModelBase
    {
        public ObservableCollection<DayModel> Days { get; set; }

        private readonly PlanningSettings _planningSettings;
        private DateTime _currentMonth;

        public DateTime CurrentMonth
        {
            get => _currentMonth;
            set
            {
                if (SetProperty(ref _currentMonth, value))
                {
                    OnPropertyChanged(nameof(MonthTitle));
                }
            }
        }

        public string MonthTitle =>
            CurrentMonth.ToString("MMMM yyyy");

        private DayModel _selectedDay;

        public DayModel SelectedDay
        {
            get => _selectedDay;
            set
            {
                if (_selectedDay != null)
                    _selectedDay.IsSelected = false;

                _selectedDay = value;

                if (_selectedDay != null)
                {
                    _selectedDay.IsSelected = true;
                    EmployeeCountInput =
                        _selectedDay.EmployeeCount?.ToString() ?? "";
                }
                else
                {
                    EmployeeCountInput = "";
                }

                OnPropertyChanged();
            }
        }

        private string _employeeCountInput;

        public string EmployeeCountInput
        {
            get => _employeeCountInput;
            set
            {
                _employeeCountInput = value;
                OnPropertyChanged();
            }
        }

        // commands

        public ICommand PreviousMonthCommand { get; }
        public ICommand NextMonthCommand { get; }
        public ICommand SelectDayCommand { get; }
        public ICommand SaveEmployeesCommand { get; }

        public CalendarViewModel(PlanningSettings planningSettings)
        {
            _planningSettings = planningSettings;

            Days = new ObservableCollection<DayModel>();

            CurrentMonth = new DateTime(
                DateTime.Today.Year,
                DateTime.Today.Month,
                1);

            PreviousMonthCommand =
                new RelayCommand(_ => ChangeMonth(-1));

            NextMonthCommand =
                new RelayCommand(_ => ChangeMonth(1));

            SelectDayCommand =
                new RelayCommand(day => SelectDay(day as DayModel));

            SaveEmployeesCommand =
                new RelayCommand(_ => SaveEmployees());

            // listen for changes made in SettingsView
            _planningSettings.PropertyChanged +=
                (sender, args) => UpdateAllStatuses();

            GenerateCalendar();
            AddSampleData();
        }

        private void ChangeMonth(int amount)
        {
            CurrentMonth = CurrentMonth.AddMonths(amount);

            SelectedDay = null;

            GenerateCalendar();
            AddSampleData();
        }

        private void GenerateCalendar()
        {
            Days.Clear();

            DateTime firstDay = CurrentMonth;

            // Monday = 0, Tuesday = 1, etc.
            int offset = ((int)firstDay.DayOfWeek + 6) % 7;

            // Start the calendar on the Monday before or on the first of the month
            DateTime startDate = firstDay.AddDays(-offset);

            // always display 6 weeks (42 cells)
            for (int i = 0; i < 42; i++)
            {
                DateTime date = startDate.AddDays(i);

                Days.Add(new DayModel
                {
                    Date = date,

                    IsCurrentMonth = date.Month == CurrentMonth.Month,

                    // check whether this date is today
                    IsToday = date.Date == DateTime.Today,

                    EmployeeCount = null,
                    Status = StaffingStatus.None
                });
            }
        }

        private void SelectDay(DayModel day)
        {
            if (day == null || !day.IsCurrentMonth)
                return;

            SelectedDay = day;
        }

        private void SaveEmployees()
        {
            if (SelectedDay == null)
                return;

            if (string.IsNullOrWhiteSpace(EmployeeCountInput))
            {
                SelectedDay.EmployeeCount = null;
            }
            else if (int.TryParse(
                EmployeeCountInput, out int employees)
                && employees >= 0)
            {
                SelectedDay.EmployeeCount = employees;
            }
            else
            {
                return;
            }

            UpdateStatus(SelectedDay);
        }

        private void UpdateStatus(DayModel day)
        {
            if (!day.EmployeeCount.HasValue)
            {
                day.Status = StaffingStatus.None;
            }
            else if (day.EmployeeCount.Value <=
                     _planningSettings.NotEnoughMax)
            {
                day.Status = StaffingStatus.NotEnough;
            }
            else if (day.EmployeeCount.Value <=
                     _planningSettings.OkayMax)
            {
                day.Status = StaffingStatus.Okay;
            }
            else
            {
                day.Status = StaffingStatus.Optimal;
            }
        }

        private void UpdateAllStatuses()
        {
            foreach (var day in Days)
            {
                UpdateStatus(day);
            }
        }

        private void AddSampleData()
        {
            // example data for September
            // *! remove this method when the API is ready

            if (CurrentMonth.Month != 9)
                return;

            SetSampleEmployees(1, 5);
            SetSampleEmployees(2, 7);
            SetSampleEmployees(3, 11);
            SetSampleEmployees(29, 7);
            SetSampleEmployees(30, 7);
        }

        private void SetSampleEmployees(int date, int employees)
        {
            var day = Days.FirstOrDefault(d =>
                d.IsCurrentMonth &&
                d.Date.HasValue &&
                d.Date.Value.Day == date);

            if (day != null)
            {
                day.EmployeeCount = employees;
                UpdateStatus(day);
            }
        }
    }
}