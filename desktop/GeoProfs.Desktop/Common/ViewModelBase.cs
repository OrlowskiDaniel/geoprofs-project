using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace GeoProfs.Desktop.Common
{
    // Every ViewModel inherits this it is what makes the UI updates itself
    // when a property changes, WPF's binding engine listens for
    // PropertyChanged and refreshes the bound control automatically
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        // Call from a property setter: SetProperty(ref _field, value);
        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
        {
            if (Equals(field, value)) return false;
            field = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            return true;
        }
    }
}
