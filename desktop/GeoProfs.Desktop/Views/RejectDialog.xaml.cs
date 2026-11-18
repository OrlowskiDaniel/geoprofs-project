using System.Windows;
using GeoProfs.Desktop.Models;

namespace GeoProfs.Desktop.Views
{
    public partial class RejectDialog : Window
    {
        public RejectDialog()
        {
            InitializeComponent();
        }

        public RejectDialog(LeaveRequest request) : this()
        {
            DataContext = request;
        }

        public string Reason => ReasonTextBox?.Text ?? string.Empty;

        private void Reject_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(Reason))
            {
                MessageBox.Show(this, "Please provide a reason for rejection.", "Missing reason", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            DialogResult = true;
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}