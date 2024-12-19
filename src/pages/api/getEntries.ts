import { NextApiRequest, NextApiResponse } from 'next';
import { ContentClient } from '@uniformdev/canvas';
import { getContentClient } from '../../utilities/canvas/canvasClients';

const getMemoizedContentClient = (() => {
  let canvasClient: ContentClient;
  return () => {
    if (!canvasClient) canvasClient = getContentClient();
    return canvasClient;
  };
})();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await getMemoizedContentClient().getEntries(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};
