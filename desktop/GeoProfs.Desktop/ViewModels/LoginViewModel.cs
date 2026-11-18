using GeoProfs.Desktop.Models;
using GeoProfs.Desktop.Services;
using GeoProfs.Desktop.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Documents;


namespace GeoProfs.Desktop.ViewModels
{
    public class LoginViewModel : ViewModelBase
    {
        private readonly IGeoProfsApiClient _apiClient;

        public LoginViewModel(IGeoProfsApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        private string _email = string.Empty;
        public string Email
        {
            get => _email;
            set => SetProperty(ref _email, value);
        }

        private string _password = string.Empty;
        public string Password
        {
            get => _password;
            set => SetProperty(ref _password, value);
        }

        private string _errorMessage = string.Empty;
        public string ErrorMessage
        {
            get => _errorMessage;
            set => SetProperty(ref _errorMessage, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }


        public User? _loggedInUser;
        public User? LoggedInUser
        {
            get => _loggedInUser;
            set => SetProperty(ref _loggedInUser, value);
        }

        private string? _token;
        public string? Token
        {
            get => _token;
            set => SetProperty(ref _token, value);
        }

        // This method is used to call the API for login and the api is async
        public async Task<bool> LoginAsync()
        {
            ErrorMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(Email) ||
                string.IsNullOrWhiteSpace(Password))
            {
                ErrorMessage = "Please enter your email and password.";
                return false;
            }

            try
            {
                IsLoading = true;

                var response = await _apiClient.LoginAsync(
                    Email,
                    Password
                );

                Token = response.Token;
                LoggedInUser = response.User;

                return true;
            }
            catch (ApiException ex)
            {
                ErrorMessage = ex.Message;
                return false;
            }
            catch (Exception)
            {
                ErrorMessage = "Unable to connect to the server.";
                return false;
            }
            finally
            {
                IsLoading = false;
            }
        }

    }

}
