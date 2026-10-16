using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;


namespace GeoProfs.Desktop.Views
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }
        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            if (DataContext is ViewModels.LoginViewModel viewModel)
            {
                viewModel.Password = PasswordInput.Password;

                var success = await viewModel.LoginAsync();

                if (success)
                {
                    DialogResult = true;
                    Close();
                }
            }
        }
    }
}
