import { signUpSchema } from "./auth.types";

const validInput = {
	username: "student",
	email: "student@example.com",
	password: "Senha@123",
	confirmPassword: "Senha@123",
};

describe("signUpSchema", () => {
	describe("valid input", () => {
		it("accepts valid registration data", () => {
			const result = signUpSchema.safeParse(validInput);

			expect(result.success).toBe(true);
		});
	});

	describe("username and email", () => {
		it("rejects a username shorter than three characters", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				username: "ab",
			});

			expect(result.success).toBe(false);
		});

		it("rejects an invalid email", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				email: "not-an-email",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("password", () => {
		it("rejects a password without an uppercase letter", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "senha@123",
				confirmPassword: "senha@123",
			});

			expect(result.success).toBe(false);
		});

		it("rejects a password shorter than eight characters", () => {
            const result = signUpSchema.safeParse({
                ...validInput,
                password: "Senh@1",
                confirmPassword: "Senh@1",
            });

            expect(result.success).toBe(false);
        });
		it("rejects a password longer than twenty characters", () => {
            const result = signUpSchema.safeParse({
                ...validInput,
                password: "senha@789101120324939232",
                confirmPassword: "senha@789101120324939232",
            });

            expect(result.success).toBe(false);
        });
		it("rejects a password without a lowercase letter", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "SENHA@123",
				confirmPassword: "SENHA@123",
			});

            expect(result.success).toBe(false);
        });
		it("rejects a password without a number", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "Senha@abc",
				confirmPassword: "Senha@abc",
			});

			expect(result.success).toBe(false);
		});
		it("rejects a password without a special character", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "Senha123",
				confirmPassword: "Senha123",
			});

			expect(result.success).toBe(false);
		});
		it("rejects mismatched password confirmation", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				confirmPassword: "Outra@123",
			});

			expect(result.success).toBe(false);
		});
		it("accepts a valid password with exactly eight characters", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "Sena@123",
				confirmPassword: "Sena@123",
			});

			expect(result.success).toBe(true);
		});
		it("accepts a valid password with exactly twenty characters", () => {
			const result = signUpSchema.safeParse({
				...validInput,
				password: "SenhaMuito@123456789",
				confirmPassword: "SenhaMuito@123456789",
			});

			expect(result.success).toBe(true);
		});
	});
});
