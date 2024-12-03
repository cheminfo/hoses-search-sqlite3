export const config = {
  contact: {
    email: 'test1@test.ch',
  },
  xyz: {
    columns: [
      {
        column: 4,
        orbital: '2s',
        algorithm: {
          name: 'GW_charged',
          version: '1.0.0',
          description: 'GW_charged test 1',
        },
      },
      {
        column: 5,
        orbital: '2s',
        algorithm: {
          name: 'dKS_charged',
          version: '1.0.0',
          description: 'dKS_charged test 1',
        },
      },
      {
        column: 6,
        orbital: '2s',
        algorithm: {
          name: 'dKS_neutral',
          version: '1.0.0',
          description: 'dKS_neutral test 1',
        },
      },
    ],
  },
};
