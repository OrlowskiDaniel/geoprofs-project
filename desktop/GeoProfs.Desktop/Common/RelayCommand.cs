using System;
using System.Windows.Input;

namespace GeoProfs.Desktop.Common
{
    // Minimal ICommand so XAML buttons can call a ViewModel method
    // (Command="{Binding ApproveCommand}") instead of using code-behind click handlers
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object? parameter) => _canExecute?.Invoke(parameter) ?? true;

        public void Execute(object? parameter) => _execute(parameter);

        public event EventHandler? CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }

        // Call this after changing a flag CanExecute depends on (IsLoading) so buttons enable/disable immediately
        public static void RaiseCanExecuteChanged() =>
            CommandManager.InvalidateRequerySuggested();
    }
}
