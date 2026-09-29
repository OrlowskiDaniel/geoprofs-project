using GeoProfs.Desktop.Services;
using GeoProfs.Desktop.ViewModels;
using GeoProfs.Desktop.Views;
using System.Windows;

namespace GeoProfs.Desktop
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            IGeoProfsApiClient apiClient = new MockGeoProfsApiClient();

            var mainViewModel = new MainViewModel(apiClient);
            var mainWindow = new MainWindow
            {
                DataContext = mainViewModel
            };

            mainWindow.Show();
        }
    }
}
