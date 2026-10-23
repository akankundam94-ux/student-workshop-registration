
import { useState } from 'react';
import './index.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  age: '',
  portfolio: '',
  workshop: '',
};

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Please enter your full name.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must have at least 2 characters.';
  }

  if (!form.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Please enter your phone number.';
  } else if (!/^\+?[\d\s()-]{9,20}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!form.date) {
    errors.date = 'Please select a workshop date.';
  } else {
    const selectedDate = new Date(`${form.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.date = 'Choose today or a future date.';
    }
  }

  if (form.age === '') {
    errors.age = 'Please enter your age.';
  } else if (Number(form.age) < 16 || Number(form.age) > 100) {
    errors.age = 'Age must be between 16 and 100.';
  }

  if (!form.portfolio.trim()) {
    errors.portfolio = 'Please enter your portfolio URL.';
  } else {
    try {
      const url = new URL(form.portfolio);

      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.portfolio = 'Use an HTTP or HTTPS URL.';
      }
    } catch {
      errors.portfolio = 'Enter a valid URL.';
    }
  }

  if (!form.workshop) {
    errors.workshop = 'Please select a workshop.';
  }

  return errors;
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage('');
      return;
    }

    const newRegistration = {
      ...form,
      id: `${Date.now()}-${Math.random()}`,
    };

    setRegistrations((current) => [
      ...current,
      newRegistration,
    ]);

    setForm(initialForm);
    setErrors({});
    setMessage(
      `Successfully registered ${newRegistration.name}!`
    );
  }

  function removeRegistration(id) {
    setRegistrations((current) =>
      current.filter((registration) => registration.id !== id)
    );

    setMessage('Registration removed successfully.');
  }

  function fieldError(name) {
    return errors[name] ? (
      <small className="error">{errors[name]}</small>
    ) : null;
  }

  const filteredRegistrations = registrations.filter((registration) => {
  const search = searchTerm.toLowerCase();

  return (
    registration.name.toLowerCase().includes(search) ||
    registration.email.toLowerCase().includes(search) ||
    registration.workshop.toLowerCase().includes(search)
  );
});

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">LEARN • CONNECT • BUILD</p>
        <h1>Workshop Registration</h1>
        <p>
          Register for a workshop, learn practical skills,
          and connect with other learners.
        </p>

        <div className="stats">
          <div>
            <strong>{registrations.length}</strong>
            <span>Registered</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Form fields</span>
          </div>
        </div>
      </header>

      <div className="layout">
        <section className="panel">
          <h2>Join a Workshop</h2>
          <p className="muted">
            Complete all fields marked with an asterisk (*).
          </p>

          {message && (
            <p className="success" role="status">
              {message}
            </p>
          )}

          {Object.values(errors).some(Boolean) && (
            <p className="error-summary" role="alert">
              Please correct the highlighted fields.
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name *</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                required
                aria-invalid={Boolean(errors.name)}
              />
              {fieldError('name')}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="email">Email address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.email)}
                />
                {fieldError('email')}
              </div>

              <div className="field">
                <label htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+256 700 000000"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[+]?[0-9 ()-]{9,20}"
                  required
                  aria-invalid={Boolean(errors.phone)}
                />
                {fieldError('phone')}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="date">Workshop date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.date)}
                />
                {fieldError('date')}
              </div>

              <div className="field">
                <label htmlFor="age">Age *</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="16"
                  max="100"
                  placeholder="16–100"
                  value={form.age}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.age)}
                />
                {fieldError('age')}
              </div>
            </div>

            <div className="field">
              <label htmlFor="portfolio">Portfolio URL *</label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                placeholder="https://example.com"
                value={form.portfolio}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.portfolio)}
              />
              {fieldError('portfolio')}
            </div>

            <div className="field">
              <label htmlFor="workshop">Choose a workshop *</label>
              <select
                id="workshop"
                name="workshop"
                value={form.workshop}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.workshop)}
              >
                <option value="">Select a workshop</option>
                <option value="React Fundamentals">
                  React Fundamentals
                </option>
                <option value="Web Design Essentials">
                  Web Design Essentials
                </option>
                <option value="Git and GitHub">
                  Git and GitHub
                </option>
                <option value="Cybersecurity Basics">
                  Cybersecurity Basics
                </option>
              </select>
              {fieldError('workshop')}
            </div>

            <button className="submit-button" type="submit">
              Register for Workshop →
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Registrations</h2>
          <p className="muted">
            Registered participants appear here immediately.
          </p>

          <input
  type="search"
  placeholder="Search by name, email, or workshop..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
  aria-label="Search registrations"
/>

          {registrations.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">✳</span>
              <h3>No registrations yet</h3>
              <p>Complete the form to add the first participant.</p>
            </div>
          ) : (
            <ul className="registration-list">
              {registrations.map((registration, index) => (
                <li key={registration.id} className="attendee">
                  <div className="attendee-heading">
                    <div className="avatar">
                      {registration.name.trim()[0].toUpperCase()}
                    </div>

                    <div className="attendee-info">
                      <h3>{registration.name}</h3>
                      <p>{registration.email}</p>
                    </div>

                    <span>#{index + 1}</span>
                  </div>

                  <div className="details">
                    <p><strong>Workshop:</strong> {registration.workshop}</p>
                    <p><strong>Date:</strong> {registration.date}</p>
                    <p><strong>Phone:</strong> {registration.phone}</p>
                    <p><strong>Age:</strong> {registration.age}</p>
                    <p>
                      <strong>Portfolio:</strong>{' '}
                      <a
                        href={registration.portfolio}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit portfolio
                      </a>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeRegistration(registration.id)}
                    aria-label={`Remove ${registration.name}`}
                  >
                    Remove Registration
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer className="footer">
        Built with React · useState · Events · Validation
      </footer>
    </main>
  );
}
