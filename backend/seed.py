from database import SessionLocal, Base, engine, Station, Route, RouteClass

Base.metadata.create_all(bind=engine)

# (city A, city B, distance in km)
CITIES = ["Kolkata", "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Jaipur",
          "Lucknow", "Bhubaneswar", "Patna", "Guwahati", "Siliguri", "Darjeeling", "Durgapur"]

# (city A, city B, distance in km) - routes are created for these pairs, both directions
PAIRS = [
    ("New Delhi", "Mumbai", 1400), ("New Delhi", "Kolkata", 1500), ("New Delhi", "Jaipur", 280),
    ("New Delhi", "Lucknow", 550), ("Mumbai", "Pune", 150), ("Mumbai", "Bengaluru", 980),
    ("Bengaluru", "Chennai", 350), ("Chennai", "Hyderabad", 630), ("Kolkata", "Chennai", 1670),
    ("Kolkata", "Patna", 530), ("Kolkata", "Guwahati", 1030), ("Kolkata", "Siliguri", 560),
    ("Kolkata", "Bhubaneswar", 440), ("Kolkata", "Durgapur", 170),
]
# code: (label, price per km, seats)
TRAIN = {"2s": ("2S — Second Sitting", 0.20, 42), "sl": ("SL — Sleeper", 0.45, 35),
         "cc": ("CC — AC Chair Car", 0.70, 24), "3e": ("3E — AC 3 Tier Economy", 0.80, 30),
         "3a": ("3A — AC 3 Tier", 1.00, 18), "2a": ("2A — AC 2 Tier", 1.50, 12),
         "1a": ("1A — AC First Class", 2.40, 6)}
BUS = {"seater": ("Non-AC Seater", 0.60, 40), "ac-seater": ("AC Seater", 0.80, 36),
       "sleeper": ("Non-AC Sleeper", 0.80, 24), "ac-sleeper": ("AC Sleeper", 1.10, 20)}
FLIGHT = {"economy": ("Economy", 1.0, 120), "premium-economy": ("Premium Economy", 1.5, 24),
          "business": ("Business", 3.0, 12)}


def hhmm(minutes):
    minutes %= 24 * 60
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def make_route(db, transport, operator, a, b, start, duration, classes):
    r = Route(transport=transport, operator=operator, origin=a, destination=b,
              depart_time=hhmm(start), arrive_time=hhmm(start + duration), duration_min=duration)
    db.add(r)
    db.flush()
    for code, (label, price, seats) in classes.items():
        db.add(RouteClass(route_id=r.id, code=code, label=label, price=price, seats=seats))


db = SessionLocal()
if db.query(Route).count():
    print("Routes already seeded, nothing to do.")
    raise SystemExit
for c in CITIES:
    for name, kind in ((f"{c} Railway Station", "train"), (f"{c} Bus Stand", "bus"), (f"{c} Airport", "flight")):
        if not db.query(Station).filter_by(name=name).first():
            db.add(Station(name=name, city=c, type=kind))

for a, b, km in PAIRS:
    for src, dst in ((a, b), (b, a)):
        for start, op in ((6 * 60 + 30, "Rajdhani Express"), (18 * 60 + 45, "Superfast Express")):
            make_route(db, "train", op, src, dst, start, int(km / 55 * 60),
                       {k: (l, max(60, round(km * p / 10) * 10), s) for k, (l, p, s) in TRAIN.items()})
        for start, op in ((8 * 60, "State Roadways"), (21 * 60, "Night Rider Travels")):
            make_route(db, "bus", op, src, dst, start, int(km / 45 * 60),
                       {k: (l, max(150, round(km * p / 10) * 10), s) for k, (l, p, s) in BUS.items()})
        for start, op in ((10 * 60, "IndiGo"), (17 * 60 + 30, "Air India")):
            base = 2500 + km * 1.6
            make_route(db, "flight", op, src, dst, start, 60 + int(km / 700 * 60),
                       {k: (l, round(base * m / 100) * 100, s) for k, (l, m, s) in FLIGHT.items()})

db.commit()
print("Seeded:", db.query(Station).count(), "stations,", db.query(Route).count(), "routes")