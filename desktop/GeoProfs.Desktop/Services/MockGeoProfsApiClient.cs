using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeoProfs.Desktop.Models;

namespace GeoProfs.Desktop.Services
{
    // Stands in for the real backend while it's still being built.
    // Implements IGeoProfsApiClient exactly like GeoProfsApiClient (the real
    // HttpClient-based version) will, so the ViewModel, the View and every
    // binding work unchanged once you swap this out in App.xaml.cs.
    //
    // TODO when the backend is live: delete this class's usage from DI
    // (App.xaml.cs) and register GeoProfsApiClient instead. Nothing in
    // ViewModels/Views needs to change.
    public class MockGeoProfsApiClient : IGeoProfsApiClient
    {
        // Simulates realistic network latency so loading states are visible.
        private static readonly TimeSpan SimulatedDelay = TimeSpan.FromMilliseconds(500);

        private readonly List<LeaveRequest> _requests = new()
        {
            new LeaveRequest { Id = 1, EmployeeName = "Anna de Vries",  StartDate = new DateTime(2026, 10, 14), EndDate = new DateTime(2026, 10, 18), Reason = "Family trip",   Status = "Pending", RequestedAt = new DateTime(2026, 10, 10) },
            new LeaveRequest { Id = 2, EmployeeName = "Milan Jansen",   StartDate = new DateTime(2026, 10, 21), EndDate = new DateTime(2026, 10, 21), Reason = "Doctor visit",  Status = "Pending", RequestedAt = new DateTime(2026, 10, 15) },
            new LeaveRequest { Id = 3, EmployeeName = "Sofie Bakker",   StartDate = new DateTime(2026, 11, 2),  EndDate = new DateTime(2026, 11, 9),  Reason = "Vacation",      Status = "Pending", RequestedAt = new DateTime(2026, 10, 20) },
            new LeaveRequest { Id = 4, EmployeeName = "Tom Willems",    StartDate = new DateTime(2026, 11, 12), EndDate = new DateTime(2026, 11, 13), Reason = "Moving house",  Status = "Pending", RequestedAt = new DateTime(2026, 10, 25) },
        };

        public async Task<List<LeaveRequest>> GetPendingApprovalsAsync()
        {
            await Task.Delay(SimulatedDelay);
            // Real endpoint only returns pending ones; mirror that here.
            return _requests.Where(r => r.Status == "Pending").ToList();
        }

        public async Task ApproveAsync(int id)
        {
            await Task.Delay(SimulatedDelay);
            var request = _requests.FirstOrDefault(r => r.Id == id);
            if (request is null)
                throw new ApiException("Leave request not found.", statusCode: 404);

            request.Status = "Approved";
        }

        public async Task RejectAsync(int id)
        {
            await Task.Delay(SimulatedDelay);
            var request = _requests.FirstOrDefault(r => r.Id == id);
            if (request is null)
                throw new ApiException("Leave request not found.", statusCode: 404);

            request.Status = "Rejected";
        }
    }
}
