/* eslint-disable no-unused-vars */

async function getMore(subjectID) {
  const infobar = document.getElementById(`${subjectID}:infobar`);

  if (infobar.children.length > 0) {
    while (infobar.firstChild) {
      infobar.removeChild(infobar.lastChild);
    }
    return;
  }

  try {
    const res = await fetch(`/more/${subjectID}`);
    const resInJSON = await res.json();

    if (res.status === 500) {
      alert(resInJSON.error);
      return;
    }

    resInJSON.forEach((data) => {
      const rowInfoCourses = document.createElement('td');
      rowInfoCourses.textContent = `Courses: ${data.Courses}`;
      infobar.appendChild(rowInfoCourses);

      const rowInfoSeminars = document.createElement('td');
      rowInfoSeminars.textContent = `Seminars: ${data.Seminars}`;
      infobar.appendChild(rowInfoSeminars);

      const rowInfoLabs = document.createElement('td');
      rowInfoLabs.textContent = `Labs: ${data.Seminars}`;
      infobar.appendChild(rowInfoLabs);
    });
  } catch (err) {
    alert(err);
  }
}

async function deleteFile(resourceName, userName) {
  const fileContainer = document.getElementById(resourceName);

  try {
    const res = await fetch(`/resources/delete/${resourceName}/${userName}`, { method: 'DELETE' });

    if (res.status === 401) {
      alert('You have no right to do that!');
      return;
    }

    if (res.status === 500) {
      const resInJSON = await res.json();
      alert(resInJSON.error);
      return;
    }

    fileContainer.remove();
  } catch (err) {
    alert(err);
  }
}

async function deleteSchedule(timeID) {
  const scheduleContainer = document.getElementById(`schedule:${timeID}`);

  try {
    const res = await fetch(`/schedules/${timeID}`, { method: 'DELETE' });
    if (res.status === 401) {
      alert('You have no right to do that!');
      return;
    }

    if (res.status === 500) {
      const resInJSON = await res.json();
      alert(resInJSON.error);
      return;
    }
    scheduleContainer.remove();
  } catch (err) {
    alert(err);
  }
}

async function deleteRequest(requestID) {
  const requestContainer = document.getElementById(`request:${requestID}`);

  try {
    const res = await fetch(`/schedules/request/${requestID}`, { method: 'DELETE' });
    if (res.status === 401) {
      alert('You have no right to do that!');
      return;
    }

    if (res.status === 500) {
      const resInJSON = await res.json();
      alert(resInJSON.error);
      return;
    }
    requestContainer.remove();
  } catch (err) {
    alert(err);
  }
}
