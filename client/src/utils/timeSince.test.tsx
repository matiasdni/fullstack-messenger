import timeSince from "./timeSince";

describe("timeSince", () => {
  it("returns the correct elapsed time in years", () => {
    const date = new Date("2010-01-01T00:00:00.000Z");
    const now = new Date("2022-01-01T00:00:00.000Z");
    const expected = "12 years";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });

  it("returns the correct elapsed time in months", () => {
    const date = new Date("2021-11-01T00:00:00.000Z");
    const now = new Date("2022-01-01T00:00:00.000Z");
    const expected = "2 months";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });

  it("returns the correct elapsed time in days", () => {
    const date = new Date("2021-12-30T00:00:00.000Z");
    const now = new Date("2022-01-01T00:00:00.000Z");
    const expected = "2 days";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });

  it("returns the correct elapsed time in hours", () => {
    const date = new Date("2022-01-01T00:00:00.000Z");
    const now = new Date("2022-01-01T02:00:00.000Z");
    const expected = "2 hours";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });

  it("returns the correct elapsed time in minutes", () => {
    const date = new Date("2022-01-01T00:00:00.000Z");
    const now = new Date("2022-01-01T00:02:00.000Z");
    const expected = "2 minutes";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });

  it("returns the correct elapsed time in seconds", () => {
    const date = new Date("2022-01-01T00:00:00.000Z");
    const now = new Date("2022-01-01T00:00:02.000Z");
    const expected = "2 seconds";
    const result = timeSince(date, now);
    expect(result).toBe(expected);
  });
});
