using GeoProfs.Desktop.Common;
using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Services;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Input;

namespace GeoProfs.Desktop.ViewModels
{
    public class CalendarViewModel : ViewModelBase
    {
        public ObservableCollection<DayModel> Days { get; set; }

        private readonly IGeoProfsApiClient _apiClient;
        private DateTime _currentMonth;
        private readonly PlanningSettings _planningSettings;
        private StaffingPlanningResponse? _planningSummary;
        public StaffingPlanningResponse? PlanningSummary
        {
            get => _planningSummary;
            private set => SetProperty(ref _planningSummary, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            private set => SetProperty(ref _isLoading, value);
        }

        private string _planningError = "";
        public string PlanningError
        {
            get => _planningError;
            private set => SetProperty(ref _planningError, value);
        }

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
                }

                OnPropertyChanged();
            }
        }

        // commands

        public ICommand PreviousMonthCommand { get; }
        public ICommand NextMonthCommand { get; }
        public ICommand SelectDayCommand { get; }

        public CalendarViewModel(
            PlanningSettings planningSettings,
            IGeoProfsApiClient apiClient)
        {
            _planningSettings = planningSettings;
            _apiClient = apiClient;

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

            GenerateCalendar();
            _ = LoadPlanningSummaryAsync();
        }

        private void ChangeMonth(int amount)
        {
            CurrentMonth = CurrentMonth.AddMonths(amount);

            SelectedDay = null;

            GenerateCalendar();
            _ = LoadPlanningSummaryAsync();
        }

        private async Task LoadPlanningSummaryAsync()
        {
            IsLoading = true;
            PlanningError = "";
            PlanningSummary = null;

            try
            {
                DateTime monthStart = CurrentMonth.Date;

                DateTime monthEnd = monthStart
                    .AddMonths(1)
                    .AddDays(-1);

                var result = await _apiClient.GetPlanningAsync(
                    monthStart,
                    monthEnd
                );

                PlanningSummary = result;

                // Update each calendar day
                foreach (var dailyData in result.Days)
                {
                    var calendarDay = Days.FirstOrDefault(d =>
                        d.Date.HasValue &&
                        d.Date.Value.Date == dailyData.Date.Date
                    );

                    if (calendarDay == null)
                        continue;

                    calendarDay.EmployeeCount = dailyData.Present;
                    calendarDay.AbsentCount = dailyData.Absent;

                    calendarDay.Status = GetStaffingStatus(
                        dailyData.Present
                    );
                }
            }
            catch (ApiException ex)
            {
                PlanningError = ex.Message;
            }
            catch (HttpRequestException ex)
            {
                PlanningError =
                    $"Could not reach the planning API: {ex.Message}";
            }
            catch (Exception ex)
            {
                PlanningError =
                    $"An unexpected error occurred: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }
        private StaffingStatus GetStaffingStatus(int present)
        {
            if (present <= _planningSettings.NotEnoughMax)
            {
                return StaffingStatus.NotEnough;
            }

            if (present <= _planningSettings.OkayMax)
            {
                return StaffingStatus.Okay;
            }

            return StaffingStatus.Optimal;
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

    }
}