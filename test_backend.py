from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# 1. Test personal impact
r = client.get('/api/impact/personal')
assert r.status_code == 200, f'Personal impact failed: {r.text}'
user = r.json()
print('Personal Impact loaded. Points:', user['totalPoints'], 'Impact Score:', user['impactScore'])

# 2. Test trip recording
r_trip = client.post('/api/impact/trips', json={
    'transportMode': 'cycling',
    'distanceKm': 5.0,
    'fromLocation': 'A',
    'toLocation': 'B'
})
assert r_trip.status_code == 200, f'Trip recording failed: {r_trip.text}'
trip_res = r_trip.json()
print('Trip recorded. Points awarded:', trip_res['trip']['pointsAwarded'], 'CO2 saved:', trip_res['trip']['estimatedCO2Avoided'])

# 3. Test report submission (0 pts initial)
r_rep = client.post('/api/impact/reports', json={
    'title': 'Broken Ramp Test',
    'description': 'Wheelchair ramp broken at civic hospital',
    'category': 'accessibility',
    'isAccessibilityIssue': True,
    'location': 'Ward 14 Civic Hospital'
})
assert r_rep.status_code == 200
rep = r_rep.json()
assert rep['pointsAwarded'] == 0, 'Submission must award 0 points'
print('Report filed with 0 initial points. ReportId:', rep['reportId'])

# 4. Test resolution reward
r_resolve = client.post(f'/api/impact/reports/{rep["reportId"]}/status', json={
    'status': 'Resolved',
    'adminNotes': 'Ramp leveled and compliant.'
})
assert r_resolve.status_code == 200
res_data = r_resolve.json()
assert res_data['pointsAwarded'] == 40, f'Accessibility should award 40 pts, got {res_data["pointsAwarded"]}'
print('Resolution awarded points:', res_data['pointsAwarded'])

# 5. Test anti-duplicate resolution
r_dup = client.post(f'/api/impact/reports/{rep["reportId"]}/status', json={
    'status': 'Resolved',
    'adminNotes': 'Duplicate attempt'
})
assert r_dup.status_code == 200
dup_data = r_dup.json()
assert dup_data['pointsAwarded'] == 0, 'Duplicate resolution must not award points again!'
print('Anti-duplicate protection passed! Duplicate awarded:', dup_data['pointsAwarded'])

# 6. Test transactions
r_txns = client.get('/api/impact/transactions')
assert r_txns.status_code == 200
print('Transactions ledger count:', len(r_txns.json()))

print('ALL BACKEND INTEGRATION & VERIFICATION TESTS PASSED SUCCESSFULLY!')
