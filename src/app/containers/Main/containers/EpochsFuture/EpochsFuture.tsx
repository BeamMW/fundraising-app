import React from 'react';

import { css } from '@linaria/core';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Window } from '@app/shared/components';
import { EpochStatsSection, ProposalsList } from '@app/containers/Main/components';
import { PROPOSALS, ROUTES } from '@app/shared/constants';
import { selectFutureProposals } from '../../store/selectors';

const StatsSectionClass = css`
  margin-bottom: 40px;
`;

const EpochsFuture: React.FC = () => {
  const navigate = useNavigate();
  const futureProposals = useSelector(selectFutureProposals());

  const handlePrevious: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.EPOCHS);
  };

  return (
    <>
      <Window onPrevious={handlePrevious}>
        <EpochStatsSection state="none" className={StatsSectionClass} />
        <ProposalsList type={PROPOSALS.FUTURE} title="Future proposals" data={futureProposals.items} />
      </Window>
    </>
  );
};

export default EpochsFuture;
