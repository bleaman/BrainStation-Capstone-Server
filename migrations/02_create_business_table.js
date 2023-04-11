exports.up = function (knex) {
	return knex.schema.createTable("businesses", function (table) {
		table.increments("id").primary();
		table.string("bizname").notNullable();
		table.string("bizcategory").notNullable();
		table.string("bizdescription").notNullable().defaultTo("No description provided.");
		table.string("bizimg").notNullable().defaultTo("https://via.placeholder.com/420x320/ff7f7f/333333?text=Business%20Image%20Goes%20Here");
		table.string("bizlocation").notNullable().defaultTo("No location provided.");
		table.string("bizphone").notNullable().defaultTo("888-888-8888");
		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("users.id");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("businesses");
};
