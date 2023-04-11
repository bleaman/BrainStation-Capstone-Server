exports.up = function (knex) {
	return knex.schema.createTable("likes", function (table) {
		table.increments("id").primary();
		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("users.id");
		table.integer("business_id").unsigned().notNullable();
		table.foreign("business_id").references("businesses.id");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("likes");
};
