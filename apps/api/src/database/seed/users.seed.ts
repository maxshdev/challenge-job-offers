import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/user.entity';
import { Role } from 'src/modules/roles/role.entity';
import { UserProfile } from 'src/modules/user-profiles/user-profile.entity';

export enum UserRole {
  SuperAdmin = 'superadmin',
  ClientAdmin = 'clientadmin',
  Manager = 'manager',
  Subscriber = 'subscriber',
  Guest = 'guest',
}

export async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const profileRepo = dataSource.getRepository(UserProfile);

  // 🔹 Asegurarnos que los roles existan
  for (const roleName of Object.values(UserRole)) {
    let role = await roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      role = roleRepo.create({ name: roleName });
      await roleRepo.save(role);
      console.log(`✅ Rol creado: ${roleName}`);
    }
  }

  const users = [
    { first_name: 'Super', last_name: 'Admin', email: 'superadmin@example.com', password: 'superadmin123', role: UserRole.SuperAdmin },
    { first_name: 'Client', last_name: 'Admin', email: 'clientadmin@example.com', password: 'clientadmin123', role: UserRole.ClientAdmin },
    { first_name: 'Manager', last_name: 'User', email: 'manager@example.com', password: 'manager123', role: UserRole.Manager },
    { first_name: 'Subscriber', last_name: 'User', email: 'subscriber@example.com', password: 'subscriber123', role: UserRole.Subscriber },
    { first_name: 'Guest', last_name: 'User', email: 'guest@example.com', password: 'guest123', role: UserRole.Guest },
  ];

  for (const userData of users) {
    const exists = await userRepo.findOne({ where: { email: userData.email } });
    if (!exists) {
      const role = await roleRepo.findOne({ where: { name: userData.role } });

      if (!role) {
        console.warn(`⚠️ Rol no encontrado: ${userData.role}`);
        continue;
      }

      const profile = profileRepo.create({
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      const newUser = userRepo.create({
        email: userData.email,
        password: userData.password,
        role,
        profile,
      });

      await userRepo.save(newUser);
      console.log(`✅ Usuario creado: ${userData.role} (${userData.email})`);
    } else {
      console.log(`⚠️ Usuario ya existe: ${userData.email}`);
    }
  }
}
