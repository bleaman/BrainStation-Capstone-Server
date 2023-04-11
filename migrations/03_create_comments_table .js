exports.up = function (knex) {
	return knex.schema.createTable("comments", function (table) {
		table.increments("id").primary();
		table.string("comment").notNullable().collate("utf8mb4_unicode_ci");
		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("users.id");
		table.integer("business_id").unsigned().notNullable();
		table.foreign("business_id").references("businesses.id");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("comments");
};
