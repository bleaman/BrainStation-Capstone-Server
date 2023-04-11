/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex("users").del();
	await knex("users").insert([
		{ name: "Landon Smith", email: "user1@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: true },
		{ name: "Kaitlyn Johnson", email: "user2@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Jaxon Brown", email: "user3@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Kiera Davis", email: "user4@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Jaiden Wilson", email: "user5@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Aria Lee", email: "user6@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Kaden Taylor", email: "user7@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Alaina Anderson", email: "user8@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Jayceon Wright", email: "user9@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Aubree Baker", email: "user10@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Emma Johnson", email: "user11@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Liam Smith", email: "user12@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Olivia Williams", email: "user13@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Ethan Brown", email: "user14@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Ava Jones", email: "user15@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Noah Garcia", email: "user16@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Isabella Miller", email: "user17@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "William Davis", email: "user18@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "Sophia Rodriguez", email: "user19@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
		{ name: "James Wilson", email: "user20@example.com", password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=", api_admin: false },
	]);
};
