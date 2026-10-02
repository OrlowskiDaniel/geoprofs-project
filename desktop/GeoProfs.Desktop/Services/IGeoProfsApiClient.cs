using GeoProfs.Desktop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoProfs.Desktop.Models;

namespace GeoProfs.Desktop.Services
{

    // This is the boundary between WPF app and backend
    // The ViewModel only ever talks to this interface, never to HttpClient or to MockGeoProfsApiClient directly
    // That is what makes the swap to the real API a oneline change later
    public interface IGeoProfsApiClient
    {
        // GET /api/approvals/pending
        Task<List<LeaveRequest>> GetPendingApprovalsAsync();

        // POST /api/approvals/{id}/approve
        Task ApproveAsync(int id);

        // POST /api/approvals/{id}/reject
        Task RejectAsync(int id);
    }
}
