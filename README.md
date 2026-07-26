# Hostel Room Allocation & Maintenance Complaint Register

## Problem Statement
Hostel room allocation and maintenance complaints are often managed manually using paper registers and verbal communication. This makes it difficult to identify vacant rooms, track complaint status, monitor pending issues, and maintain accurate records. The absence of a centralized system can lead to duplicate complaints, delayed resolutions, and inefficient hostel management.

## Objective
The objective of this project is to develop a simple web-based register that helps hostel wardens manage room occupancy and maintenance complaints efficiently. The system provides a clear view of room availability, complaint status, and pending maintenance requests while ensuring that records can be searched, updated, and maintained easily.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- Browser Local Storage

## Features
- Display hostel room and complaint records
- Search records using room number or occupant name
- Filter records based on complaint status
- Add new room and complaint records
- Edit existing records
- Delete records when required
- View vacant room information
- Track complaint status (Pending, In Progress, Resolved)
- Automatic calculation of pending days
- Loading state handling
- Empty state handling
- Error state handling
- Responsive user interface for desktop and mobile devices
- Data persistence using browser Local Storage

## How to Run the Application
1. Download or clone the project repository.
2. Ensure the following files are placed in the same folder:
   - index.html
   - style.css
   - script.js
   - hostel-final_orig.jpg
3. Open the `index.html` file in any modern web browser.
4. The application will load automatically and display the hostel records.

## Screenshots

### Dashboard
![Dashboard](Dashboard.jpeg)

### Search Functionality
![Search](search.jpeg)

### Add Record Form
![Add Record](add-record.jpeg)

### Responsive Mobile View
![Mobile View](mobile-view.jpeg)
## Dataset Fields

| Field Name | Description |
|------------|-------------|
| record_id | Unique identifier for each record |
| room_no | Room number |
| block | Hostel block name |
| occupant_name | Name of the room occupant |
| complaint_type | Type of maintenance complaint |
| reported_date | Date on which the complaint was reported |
| status | Complaint status (Pending, In Progress, Resolved) |
| resolved_date | Date on which the complaint was resolved |

## Derived Value

### Days Pending
The application automatically calculates the number of days a complaint has remained unresolved.

Formula:

Days Pending = Current Date − Reported Date

This value helps the warden identify overdue complaints and prioritize maintenance activities.

## Project Outcome
This project provides a simple and user-friendly solution for managing hostel room occupancy and maintenance complaints. It reduces manual effort, improves record management, helps track complaint progress, and provides better visibility of hostel operations.

## Limitations
- Data is stored only in the browser's Local Storage.
- No backend server or database is used.
- Data may be lost if browser storage is cleared.

## Future Enhancements
- Database integration
- User authentication
- Complaint priority levels
- Email notifications
- Report generation
- Dashboard analytics

## Conclusion
The Hostel Room Allocation and Maintenance Complaint Register is a simple web application developed using HTML, CSS, and JavaScript. It helps hostel administrators manage room occupancy and maintenance complaints effectively while providing a clean and responsive user experience.