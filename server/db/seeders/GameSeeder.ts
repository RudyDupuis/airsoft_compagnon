import { isNull } from '~/utils/types/typeGuards'
import { TypeORM } from '../config'
import { Game, GameType, PrivacyType } from '../entities/Game'
import { User } from '../entities/User'

export const gameSeeds = [
  {
    name: 'Opération Forêt Noire',
    description:
      "Partie tactique en forêt avec objectifs multiples. Venez avec votre équipement complet et prêt pour 6h d'action.",
    startDateTime: new Date('2030-05-10T09:00:00'),
    endDateTime: new Date('2030-05-10T15:00:00'),
    gameType: GameType.OP,
    latitude: 48.5734,
    longitude: 7.7521,
    address: 'Route Forestière, 67000 Strasbourg, France',
    allowedConsumables:
      'BBs biodégradables uniquement. Grenades fumigènes autorisées. Pas de grenades à fragmentation.',
    price: 25.5,
    minimalReputation: 3,
    allowedNotRated: true,
    hasAmenities: true,
    hasParking: true,
    hasEquipmentRental: true,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 40,
    createdAt: new Date('2025-03-10'),
    createdById: 1,
    participantsId: []
  },
  {
    name: 'Dominicale Urbex',
    description:
      'Partie dominicale dans une zone urbaine abandonnée. Rythme détendu, parfait pour les débutants et intermédiaires.',
    startDateTime: new Date('2030-05-04T10:00:00'),
    endDateTime: new Date('2030-05-04T16:00:00'),
    gameType: GameType.DOMINICAL,
    latitude: 45.7578,
    longitude: 4.832,
    address: '10 Rue des Fantasques, 69001 Lyon, France',
    allowedConsumables: 'BBs biodégradables obligatoires. Grenades autorisées.',
    price: 15.0,
    minimalReputation: 4,
    allowedNotRated: false,
    hasAmenities: false,
    hasParking: true,
    hasEquipmentRental: false,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 30,
    createdAt: new Date('2025-02-19'),
    createdById: 2,
    participantsId: [1, 4]
  },
  {
    name: 'Night Ops Elite',
    description:
      'Opération nocturne réservée aux joueurs confirmés. Équipement night vision recommandé. Scénarios tactiques avancés.',
    startDateTime: new Date('2030-05-15T20:00:00'),
    endDateTime: new Date('2030-05-16T02:00:00'),
    gameType: GameType.OP,
    latitude: 50.6333,
    longitude: 3.0667,
    address: 'Chemin du Fort, 59800 Lille, France',
    allowedConsumables: 'BBs bio uniquement. Cyalumes et IR beacons autorisés. Fumigènes limités.',
    price: 35.0,
    minimalReputation: 2,
    allowedNotRated: true,
    hasAmenities: true,
    hasParking: true,
    hasEquipmentRental: true,
    privacyType: PrivacyType.PRIVATE,
    maxParticipants: 24,
    createdAt: new Date('2025-01-25'),
    createdById: 3,
    participantsId: [4]
  },
  {
    name: 'Partie forestière du dimanche',
    description:
      'Partie classique en forêt dense, nombreux abris naturels et zones de combat variées.',
    startDateTime: new Date('2030-05-18T09:30:00'),
    endDateTime: new Date('2030-05-18T15:30:00'),
    gameType: GameType.DOMINICAL,
    latitude: 44.8378,
    longitude: -0.5792,
    address: 'Forêt du Taillan-Médoc, 33320 Le Taillan-Médoc, France',
    allowedConsumables: 'BBs bio. Pas de grenades à CO2.',
    price: 12.0,
    minimalReputation: 0,
    allowedNotRated: true,
    hasAmenities: false,
    hasParking: true,
    hasEquipmentRental: false,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 50,
    createdAt: new Date('2024-12-12'),
    createdById: 1,
    participantsId: [1]
  },
  {
    name: 'CQB Warehouse',
    description:
      'Combat rapproché dans un entrepôt aménagé. Nombreux couloirs et salles. Idéal pour les AEGs compactes.',
    startDateTime: new Date('2030-06-01T13:00:00'),
    endDateTime: new Date('2030-06-01T18:00:00'),
    gameType: GameType.OP,
    latitude: 48.8723,
    longitude: 2.2951,
    address: '24 Rue Nungesser et Coli, 92150 Suresnes, France',
    allowedConsumables: 'BBs bio 0.20g-0.25g conseillées. Grenades à ressort uniquement.',
    price: 22.5,
    minimalReputation: 2,
    allowedNotRated: true,
    hasAmenities: true,
    hasParking: false,
    hasEquipmentRental: true,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 20,
    createdAt: new Date(),
    createdById: 2,
    participantsId: [1, 4]
  },
  {
    name: 'Milsim Opération Dragon',
    description:
      'Weekend complet en mode milsim. Nécessite équipement complet, répliques réalistes et tenue adaptée.',
    startDateTime: new Date('2030-06-20T08:00:00'),
    endDateTime: new Date('2030-06-21T18:00:00'),
    gameType: GameType.OP,
    latitude: 49.1234,
    longitude: 2.5678,
    address: "Domaine de Chantilly, Route d'Apremont, 60500 Vineuil-Saint-Firmin, France",
    allowedConsumables:
      'BBs bio uniquement. Pas de limite de chargeurs. Grenades, fumigènes et flashbangs autorisés.',
    price: 75.0,
    minimalReputation: 3,
    allowedNotRated: true,
    hasAmenities: true,
    hasParking: true,
    hasEquipmentRental: false,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 60,
    createdAt: new Date('2024-10-10'),
    createdById: 3,
    participantsId: []
  },
  {
    name: 'Partie débutants friendly',
    description:
      "Session d'initiation spécialement conçue pour les nouveaux joueurs d'airsoft qui souhaitent découvrir ce sport dans les meilleures conditions possibles. Notre équipe de joueurs expérimentés vous accompagnera tout au long de cette journée avec un rythme adapté, de nombreuses explications sur les règles, l'équipement et les techniques de base. Le terrain a été spécialement aménagé pour offrir différentes zones de jeu accessibles aux débutants : zones dégagées pour faciliter la visibilité, bunkers simples pour apprendre le jeu de couverture, et quelques zones plus techniques pour ceux qui se sentent prêts à relever des défis. Des pauses régulières sont prévues pour permettre des débriefings, répondre à vos questions, et vous donner des conseils personnalisés pour améliorer votre expérience. Les scénarios proposés seront progressifs en difficulté, commençant par des objectifs simples jusqu'à des missions plus élaborées en fin de journée. Aucune expérience préalable n'est requise, et l'atmosphère sera détendue et bienveillante pour assurer que chacun prenne du plaisir, quel que soit son niveau.",
    startDateTime: new Date('2030-05-25T10:00:00'),
    endDateTime: new Date('2030-05-25T15:00:00'),
    gameType: GameType.DOMINICAL,
    latitude: 43.2965,
    longitude: 5.3698,
    address: 'Chemin du Vallon de Toulouse, 13009 Marseille, France',
    allowedConsumables: "BBs fournies. Pas d'équipement spécial nécessaire.",
    price: 10.0,
    minimalReputation: 0,
    allowedNotRated: true,
    hasAmenities: true,
    hasParking: true,
    hasEquipmentRental: true,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 25,
    createdAt: new Date('2025-02-15'),
    createdById: 1,
    participantsId: []
  },
  {
    name: 'Retour aux sources',
    description:
      'Partie nostalgique organisée pour les anciens du club, retour sur notre premier terrain de jeu ! Ambiance conviviale, scénarios rétro et barbecue en fin de journée.',
    startDateTime: new Date('2018-09-16T09:00:00'),
    endDateTime: new Date('2018-09-16T16:00:00'),
    gameType: GameType.DOMINICAL,
    latitude: 45.764,
    longitude: 4.8357,
    address: 'Ancien Terrain Club, 123 Ancienne Route, 69000 Lyon, France',
    allowedConsumables: 'BBs standard acceptées. Pas de grenades, ambiance détendue.',
    price: 5.0,
    minimalReputation: 0,
    allowedNotRated: true,
    hasAmenities: false,
    hasParking: true,
    hasEquipmentRental: false,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 30,
    createdAt: new Date('2018-07-01'),
    createdById: 2,
    participantsId: [1, 2, 3, 4]
  },
  {
    name: 'Assaut Printanier',
    description:
      "Scénario d'assaut en équipe dans une zone boisée vallonnée. Missions offensives et défensives alternées, idéal pour perfectionner sa coordination et sa stratégie. Prévoir des protections supplémentaires, terrain humide.",
    startDateTime: new Date('2017-04-22T08:30:00'),
    endDateTime: new Date('2017-04-22T14:00:00'),
    gameType: GameType.OP,
    latitude: 47.2184,
    longitude: -1.5536,
    address: 'Bois de la Gournerie, 44800 Saint-Herblain, France',
    allowedConsumables:
      'BBs classiques et bio. Fumigènes autorisés sous contrôle. Pas de grenades sonores.',
    price: 8.0,
    minimalReputation: 0,
    allowedNotRated: true,
    hasAmenities: false,
    hasParking: true,
    hasEquipmentRental: false,
    privacyType: PrivacyType.PUBLIC,
    maxParticipants: 36,
    createdAt: new Date('2017-02-10'),
    createdById: 4,
    participantsId: [1, 2, 3, 4],
    hasGeneratedRatings: true
  }
]

export async function seedGames() {
  const gameRepository = TypeORM.getRepository(Game)
  const userRepository = TypeORM.getRepository(User)

  for (const seed of gameSeeds) {
    const createdBy = await userRepository.findOne({
      where: { id: seed.createdById }
    })
    if (isNull(createdBy)) {
      console.error(`User with ID ${seed.createdById} not found for game ${seed.name}`)
      continue
    }

    const participants =
      seed.participantsId.length > 0
        ? await userRepository.find({
            where: seed.participantsId.map((id) => ({ id }))
          })
        : []

    const game = gameRepository.create({
      name: seed.name,
      description: seed.description,
      startDateTime: seed.startDateTime,
      endDateTime: seed.endDateTime,
      gameType: seed.gameType,
      latitude: seed.latitude,
      longitude: seed.longitude,
      address: seed.address,
      allowedConsumables: seed.allowedConsumables,
      price: seed.price,
      minimalReputation: seed.minimalReputation,
      allowedNotRated: seed.allowedNotRated,
      hasAmenities: seed.hasAmenities,
      hasParking: seed.hasParking,
      hasEquipmentRental: seed.hasEquipmentRental,
      privacyType: seed.privacyType,
      maxParticipants: seed.maxParticipants,
      createdAt: seed.createdAt,
      createdBy: createdBy,
      participants: participants,
      hasGeneratedRatings: seed.hasGeneratedRatings
    })

    await gameRepository.save(game)
  }
}
