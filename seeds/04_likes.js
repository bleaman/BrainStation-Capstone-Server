/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex("likes").del();
	await knex("likes").insert([
		{ user_id: 1, business_id: 2 },
		{ user_id: 1, business_id: 3 },
		{ user_id: 2, business_id: 1 },
		{ user_id: 2, business_id: 2 },
		{ user_id: 2, business_id: 3 },
		{ user_id: 3, business_id: 1 },
		{ user_id: 3, business_id: 2 },
		{ user_id: 3, business_id: 3 },
		{ user_id: 4, business_id: 1 },
		{ user_id: 4, business_id: 2 },
		{ user_id: 4, business_id: 3 },
		{ user_id: 5, business_id: 1 },
		{ user_id: 5, business_id: 2 },
		{ user_id: 5, business_id: 3 },
		{ user_id: 6, business_id: 1 },
		{ user_id: 6, business_id: 2 },
		{ user_id: 6, business_id: 3 },
	]);
};
